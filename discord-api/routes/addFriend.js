const express = require('express')
const db = require('../db')
const router = express.Router()

router.post('/add-friend', (req, res) => {
    const { senderId, receiverId } = req.body

    friendId = receiverId
    const addFriendQuery = `
    INSERT INTO friends (user_id, friend_id, state, sender_id)
    VALUES (?, ?, 'pending', ?),
            (?, ?, 'pending', ?);
    `
    db.query(addFriendQuery, [senderId, receiverId, senderId, receiverId, senderId, senderId], (error, addFriendResults) => {
        if (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        console.log("friend added successfully!")
        res.status(200).json({ friendId })
    });
});

module.exports = router;