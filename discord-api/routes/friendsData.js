const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/get-friends/:userID', (req, res) => {
    const userId = req.params.userID
    friendsQuery = `SELECT friend_id FROM friends WHERE user_id = ?`

    db.query(friendsQuery, [userId], (err, results) => {
        if (err) {
            console.log("Error quering friends from DB")
            res.status(500).json({ error: 'Error querying MySQL' });
            return
        }
        const friendIds = results.map(result => result.friend_id)
        var friendsInfo = [];

        // Loop through each friend ID and query their information
        friendIds.forEach(friendId => {
            const userInfoQuery = `SELECT * FROM users WHERE user_id = ?`;

            db.query(userInfoQuery, [friendId], (err, userResults) => {
                if (err) {
                    console.error('Error querying MySQL: ', err);
                    return;
                }
                if (userResults.length > 0) {
                    friendsInfo.push(userResults[0]);
                }
                if (friendsInfo.length === friendIds.length) {
                    res.json({ friendsInfo });
                }
            });
        });
    });
});

module.exports = router;