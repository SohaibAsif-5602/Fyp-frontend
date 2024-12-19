import axios from 'axios';
import db from '../db.js';
import { deleteRecords } from '../Services/dbService.js';


export const getPondData = (req, res) => {
    const userId = req.userId;
    const pondId = req.params.pondId;

    const query = `
        SELECT p.channel_id, p.status, i.channel_read 
        FROM Pond p 
        JOIN Iot i ON p.channel_id = i.channel_id 
        WHERE p.pond_id = ? AND p.user_id = ?
    `;

    db.query(query, [pondId, userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Pond not found or access denied' });
        }

        const { channel_id, channel_read, status } = results[0];

        // Check pond status
        if (status === 'waiting_for_approval') {
            return res.status(403).json({ msg: 'Pond is waiting for approval' });
        }

        if (status !== 'approved') {
            return res.status(400).json({ msg: 'Invalid pond status' });
        }

        const url = `https://api.thingspeak.com/channels/${channel_id}/feeds.json?api_key=${channel_read}&results=100`;

        axios.get(url)
            .then(response => {
                const feeds = response.data.feeds;
                const formattedDates = feeds.map(feed => feed.created_at.split('T')[0]);

                const temperatureData = feeds.map(feed => ({
                    date: feed.created_at.split('T')[0],
                    value: parseFloat(feed.field1),
                }));

                const phData = feeds.map(feed => ({
                    date: feed.created_at.split('T')[0],
                    value: parseFloat(feed.field2),
                }));

                const turbidityData = feeds.map(feed => ({
                    date: feed.created_at.split('T')[0],
                    value: parseFloat(feed.field3),
                }));

                res.status(200).json({
                    status, // Include status in the response
                    temperatureData,
                    phData,
                    turbidityData,
                    dates: [...new Set(formattedDates)],
                });
            })
            .catch(error => {
                console.error('Error fetching data from ThingSpeak:', error);
                res.status(500).json({ msg: 'Error fetching data from ThingSpeak' });
            });
    });
};


export const addPond = async (req, res) => {
    const { channelName, location, fishSpecies, fishAge } = req.body;
    const userId = req.userId;

    if (!channelName || !location || !fishSpecies || !fishAge || !userId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    let channelId, fishId;

    try {
        const channelResponse = await axios.post('https://api.thingspeak.com/channels.json', {
            api_key: process.env.THINGSPEAK_API_KEY,
            name: channelName,
            public_flag: true,
            field1: 'Temperature',
            field2: 'pH',
            field3: 'Turbidity',
        });

        channelId = channelResponse.data.id;
        let writeApiKey = '', readApiKey = '';

        channelResponse.data.api_keys.forEach((key) => {
            if (key.write_flag) {
                writeApiKey = key.api_key;
            } else {
                readApiKey = key.api_key;
            }
        });

        db.query(
            'INSERT INTO Iot (channel_id, channel_read, channel_write) VALUES (?, ?, ?)',
            [channelId, readApiKey, writeApiKey],
            (error) => {
                if (error) {
                    console.error('Error inserting ThingSpeak data into the database:', error);
                    return res.status(500).json({ error: 'Failed to insert ThingSpeak data into the database' });
                }

                // Proceed to insert fish data
                insertFishData();
            }
        );

        // Function to insert fish data
        function insertFishData() {
            db.query(
                'INSERT INTO Fishgroup (age, specie, imagelink,pond_name) VALUES (?, ?, ?,?)',
                [fishAge, fishSpecies, "https://res.cloudinary.com/dfegwo1lv/image/upload/v1734630806/images_1_bdx1zo.jpg",channelName], // Replace with actual image link if available
                (error, fishResult) => {
                    if (error) {
                        console.error('Error inserting fish data into the database:', error);
                        return res.status(500).json({ error: 'Failed to insert fish data into the database' });
                    }

                    fishId = fishResult.insertId;
                    insertPondData();
                }
            );
        }

        // Function to insert pond data
        function insertPondData() {
            db.query(
                'INSERT INTO Pond (channel_id, pond_name, pond_loc, fish_id, user_id) VALUES (?, ?, ?, ?, ?)',
                [channelId, channelName, location, fishId, userId, 0], // Assuming pond_score is initialized to 0
                (error) => {
                    if (error) {
                        console.error('Error inserting pond data into the database:', error);
                        return res.status(500).json({ error: 'Failed to insert pond data into the database' });
                    }

                    // Send the success response
                    res.status(200).json({ message: 'Pond and channel created successfully' });
                }
            );
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};

export const deletePond = (req, res) => {
    const userId = req.userId;
    const pondId = req.params.pondId;

    const verifyQuery = 'SELECT pond_id, channel_id, fish_id FROM Pond WHERE pond_id = ? AND user_id = ?';
    db.query(verifyQuery, [pondId, userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: "Database query error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ msg: "Pond not found or does not belong to the user." });
        }

        const { channel_id, fish_id } = results[0];

        deleteRecords(channel_id, fish_id, pondId, res);
    });
};


export const getPonds = (req, res) => {
    const userId = req.userId; 

    const query = `
        SELECT
            p.pond_id,
            p.pond_name,
            p.pond_loc,
            f.specie,
            f.imagelink,
            p.status
        FROM Pond p
        JOIN Fishgroup f ON p.fish_id = f.id
        WHERE p.user_id = ?`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: "Database query error" });
        }

        return res.status(200).json({ ponds: results });
    });
};

export const editPond = async (req, res) => {
    const { pondName, location, fishSpecies, fishAge } = req.body;
    const { pondId } = req.params;
  
    console.log(pondId, pondName, location, fishSpecies, fishAge);
  
    if (!pondName || !location || !fishSpecies || !fishAge) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      // Update pond details in the database
      db.query(
        'UPDATE Pond SET pond_name = ?, pond_loc = ? WHERE pond_id = ?',
        [pondName, location, pondId],
        (error) => {
          if (error) {
            console.error('Error updating pond:', error);
            return res.status(500).json({ error: 'Failed to update pond details.' });
          }
  
          // Fetch fish_id associated with the pond
          db.query(
            'SELECT fish_id FROM Pond WHERE pond_id = ?',
            [pondId],
            (fetchError, results) => {
              if (fetchError) {
                console.error('Error fetching fish_id:', fetchError);
                return res.status(500).json({ error: 'Failed to retrieve fish details.' });
              }
  
              if (results.length === 0) {
                return res.status(404).json({ error: 'Pond not found.' });
              }
  
              const fishId = results[0].fish_id;
  
              // Update fish details in the Fishgroup table
              db.query(
                'UPDATE Fishgroup SET age = ?, specie = ? ,pond_name = ? WHERE id = ?',
                [fishAge, fishSpecies,pondName, fishId],
                (fishError) => {
                  if (fishError) {
                    console.error('Error updating fish data:', fishError);
                    return res.status(500).json({ error: 'Failed to update fish details.' });
                  }
  
                  res.status(200).json({ message: 'Pond and fish details updated successfully.' });
                }
              );
            }
          );
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  };
  
  export const getPondById = (req, res) => {
    const pondId = req.params.pondId; // Extract pond ID from request parameters
    const userId = req.userId;
    
    const query = `
        SELECT
            p.pond_id,
            p.pond_name,
            p.pond_loc,
            f.specie,
            f.age AS fish_age,
            f.imagelink AS fish_image,
            p.status
        FROM Pond p
        JOIN Fishgroup f ON p.fish_id = f.id
        WHERE p.pond_id = ? AND p.user_id = ?`;

    db.query(query, [pondId, userId], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: "Database query error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ msg: "Pond not found or access denied" });
        }

        const pond = {
            pondId: result[0].pond_id,
            pondName: result[0].pond_name,
            pondLocation: result[0].pond_loc,
            fishSpecies: result[0].specie,
            fishAge: result[0].fish_age,
            fishImage: result[0].fish_image,
            status: result[0].status,
        };

        return res.status(200).json({ pond });
    });
};

