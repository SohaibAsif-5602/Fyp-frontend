import db from '../db.js';

export const deleteRecords = (channel_id, fish_id, pondId, res) => {
    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            return res.status(500).json({ msg: "Transaction error." });
        }

        const deletePondQuery = 'DELETE FROM Pond WHERE pond_id = ?';
        db.query(deletePondQuery, [pondId], (pondErr) => {
            if (pondErr) {
                return db.rollback(() => {
                    res.status(500).json({ msg: "Error deleting pond." });
                });
            }

            const deleteAlertsQuery = 'DELETE FROM Alert WHERE channel_id = ?';
            db.query(deleteAlertsQuery, [channel_id], (alertErr) => {
                if (alertErr) {
                    return db.rollback(() => {
                        res.status(500).json({ msg: "Error deleting alerts." });
                    });
                }

                const deleteIotQuery = 'DELETE FROM Iot WHERE channel_id = ?';
                db.query(deleteIotQuery, [channel_id], (iotErr) => {
                    if (iotErr) {
                        return db.rollback(() => {
                            res.status(500).json({ msg: "Error deleting IoT channel." });
                        });
                    }

                    const deleteFishQuery = 'DELETE FROM Fishgroup WHERE id = ?';
                    db.query(deleteFishQuery, [fish_id], (fishErr) => {
                        if (fishErr) {
                            return db.rollback(() => {
                                res.status(500).json({ msg: "Error deleting fish data." });
                            });
                        }

                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    res.status(500).json({ msg: "Transaction commit error." });
                                });
                            }
                            res.status(200).json({ msg: "Pond and related data deleted successfully." });
                        });
                    });
                });
            });
        });
    });
};
