const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/get-opened-dms/:userId', (req, res) => {
    const { userId } = req.params
    const dmsQuery = `
    SELECT DISTINCT CASE
        WHEN sender_id = ? THEN receiver_id
        ELSE sender_id
    END AS partner_id
    FROM dms
    WHERE sender_id = ? OR receiver_id = ?

    `

    db.query(dmsQuery, [userId, userId, userId], (error, results) => {
        if (error) {
            console.error('Error fetching direct messages:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json({ openedDms: results });
    });
});

module.exports = router;