const express = require('express')
const db = require('../db')
const router = express.Router()

router.delete('/delete-dm', (req, res) => {
    const { sender_id, dm_id } = req.body
    const senderId =  Number(sender_id)

    const authQuery = `SELECT sender_id FROM dms WHERE dm_id = ?`
    db.query(authQuery, [dm_id], (error, authResults) => {
        if (error) {
        console.error('Error adding dms', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
        }

        const deleteDmsQuery = `DELETE FROM dms WHERE dm_id = ?`
        db.query(deleteDmsQuery, [dm_id], (error, deleteResults) => {
            if (error) {
            console.error('Error adding dms', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
            }
            res.status(200).json({msg: "dms deleted successfully!"})
        });
    });
});

module.exports = router;