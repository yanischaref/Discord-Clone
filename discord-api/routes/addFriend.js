const express = require('express')
const db = require('../db')
const router = express.Router()

router.post('/add-friend', (req, res) => {
    console.log("Adding Friend...")
    const { senderId, receiverUsername } = req.body
    console.log(req.body)

    const getUserId = `SELECT user_id FROM users WHERE username = ?`
    db.query(getUserId, [receiverUsername], (error, getUserResults) => {
        if (error) {
            console.error('No user found!', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (getUserResults.length === 0) {
            console.log("user not found opps! ")
            return
        }
        const receiverId = getUserResults[0].user_id
        const addFriendQuery = `
    INSERT INTO friends (user_id, friend_id)
    VALUES (?, ?),
            (?, ?);
    `
        db.query(addFriendQuery, [senderId, receiverId, receiverId, senderId], (error, addFriendResults) => {
            if (error) {
                console.error('Error adding friend', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.status(200).json({ msg: "dms added successfully!" })
        });
    });
});

module.exports = router;