import db from '../db.js';

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
    const userId = req.userId; 
    const { username, email, imagelink, D_O_B, contact_no, gender } = req.body;

    const query = `
        UPDATE Users 
        SET username = ?, email = ?, imagelink = ?, D_O_B = ?, contact_no = ?, gender = ?
        WHERE user_id = ?
    `;

    db.query(
        query, 
        [username, email, imagelink, D_O_B, contact_no, gender, userId], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ msg: 'Database update error', error: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'User not found' });
            }

            res.status(200).json({ msg: 'User updated successfully' });
        }
    );
};
