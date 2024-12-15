import db from '../db.js';
import fs from 'fs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const storage = multer.memoryStorage();
  const upload = multer({ storage }).single('image'); // Expect a single image

  const getBufferFromTempFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data); // 'data' is the buffer
            }
        });
    });
};
  const saveBase64AsImage = (base64String, outputPath) => {
    return new Promise((resolve, reject) => {
        // Extract the Base64 part
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Write the buffer to a file
        fs.writeFile(outputPath, buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(outputPath);
            }
        });
    });
};

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  };

export const getUser = (req, res) => {
    const userId = req.userId;

    const query = 'SELECT user_id, email, username, date_of_joining, imagelink, D_O_B, contact_no, gender FROM Users WHERE user_id = ?';
    
    db.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: 'Database query error', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json(result[0]);
    });
};





export const updateUser = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error during file upload', error: err.message });
        }

        try {
            const { username, email, D_O_B, contact_no, gender, imageBase64 } = req.body;

            let imageUrl = null;

            // Upload image to Cloudinary if Base64 data is provided
            if (imageBase64) {
                const tempFilePath = path.join('temp-image.jpeg');
                await saveBase64AsImage(imageBase64, tempFilePath);
                const imageBuffer = await fs.promises.readFile(tempFilePath);

                // Upload the temporary file to Cloudinary
                imageUrl = await uploadToCloudinary(imageBuffer);

                // Delete the temporary file
                await fs.promises.unlink(tempFilePath);
            }

            const query = `
                UPDATE Users 
                SET username = ?, email = ?, imagelink = ?, D_O_B = ?, contact_no = ?, gender = ?
                WHERE user_id = ?
            `;

            db.query(
                query,
                [username, email, imageUrl, D_O_B, contact_no, gender, req.userId],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ msg: 'Database update error', error: err });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({ msg: 'User not found' });
                    }

                    res.status(200).json({ msg: 'User updated successfully', imagelink: imageUrl });
                }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating profile', error: error.message });
        }
    });
};




