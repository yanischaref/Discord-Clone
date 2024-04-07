const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/get-dm/:senderId/:receiverId', (req, res) => {
    var senderData
    var receiverData
    const { senderId, receiverId } = req.params
    const dmsQuery = `
        SELECT *
        FROM dms
        WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
        ORDER BY sent_at;
    `

    db.query(dmsQuery, [senderId, receiverId, receiverId, senderId], (error, results) => {
        if (error) {
            console.error('Error fetching direct messages:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const senderQuery = `SELECT * FROM users WHERE user_id = ?;`
        const receiverQuery = `SELECT * FROM users WHERE user_id = ?;`
        db.query(senderQuery, [senderId], (error, senderResults) => {
            if (error) {
                console.error('Error fetching direct messages:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            senderData = senderResults
            db.query(receiverQuery, [receiverId], (error, receiverResults) => {
                if (error) {
                    console.error('Error fetching direct messages:', error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                receiverData = receiverResults
                res.json({
                    senderInfo: senderData,
                    receiverInfo: receiverData,
                    dms: results
                });
            })
        })
    });
});

module.exports = router;