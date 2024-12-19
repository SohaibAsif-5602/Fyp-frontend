import db from '../db.js';

export const addDefaultAction = (req, res) => {
    const { pond_id } = req.body;

    if (!pond_id) {
        return res.status(400).json({ message: 'pond_id is required' });
    }

    const query = `
        INSERT INTO Actions (pond_id, ph_alert, temp_alert, turbidity_alert, temp_action)
        VALUES (?, true, true, true, true)
    `;

    db.query(query, [pond_id], (err, result) => {
        if (err) {
            console.error('Error adding default action:', err);
            return res.status(500).json({ message: 'Failed to add default action' });
        }

        res.status(201).json({ message: 'Default action added successfully', action_id: result.insertId });
    });
};


export const updateAction = (req, res) => {
    const { action_id } = req.params;
    const { ph_alert, temp_alert, turbidity_alert, temp_action } = req.body;

    const query = `
        UPDATE Actions
        SET ph_alert = ?, temp_alert = ?, turbidity_alert = ?, temp_action = ?
        WHERE action_id = ?
    `;

    db.query(query, [ph_alert || null, temp_alert || null, turbidity_alert || null, temp_action || false, action_id], (err, result) => {
        if (err) {
            console.error('Error updating action:', err);
            return res.status(500).json({ message: 'Failed to update action' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.status(200).json({ message: 'Action updated successfully' });
    });
};

// export const getActions = (req, res) => {
//     const query = `SELECT * FROM Actions`;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching actions:', err);
//             return res.status(500).json({ message: 'Failed to retrieve actions' });
//         }

//         res.status(200).json({ message: 'Actions retrieved successfully', data: results });
//     });
// };

export const getActionById = (req, res) => {
    const { action_id } = req.params;

    const query = `SELECT * FROM Actions WHERE action_id = ?`;

    db.query(query, [action_id], (err, result) => {
        if (err) {
            console.error('Error fetching action:', err);
            return res.status(500).json({ message: 'Failed to retrieve action' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.status(200).json({ message: 'Action retrieved successfully', data: result[0] });
    });
};
