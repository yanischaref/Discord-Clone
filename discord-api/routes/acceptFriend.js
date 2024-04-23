const express = require('express')
const db = require('../db')
const router = express.Router()

router.put('/accept-friend', (req, res) => {
    const { userId, receiverId } = req.body

    const sql = `UPDATE friends SET state = 'accepted'
    WHERE user_id IN(?, ?) AND friend_id IN(?, ?)`
    db.query(sql, [userId, receiverId, userId, receiverId], (err, results) => {
        if (err) {
            console.error('Error updating username:', err);
            res.status(500).json({ error: 'Error updating username' });
            return;
        }
        res.status(200).json({ message: 'friend accepted successfully!' });
    });
});

module.exports = router;