const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/get-opened-dms/:userId', (req, res) => {
    const { userId } = req.params
    const dmsQuery = `
    SELECT DISTINCT GREATEST(sender_id, receiver_id) AS receiver_id
    FROM dms
    WHERE ? IN (sender_id, receiver_id)
    `

    db.query(dmsQuery, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching direct messages:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json({ openedDms: results });
    });
});

module.exports = router;