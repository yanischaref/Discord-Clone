const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/get-friends/:userID', (req, res) => {
    const userId = req.params.userID
    friendsQuery = `SELECT friend_id, state FROM friends WHERE user_id = ?`

    db.query(friendsQuery, [userId], (err, results) => {
        if (err) {
            console.log("Error quering friends from DB")
            res.status(500).json({ error: 'Error querying MySQL' });
            return
        }
        const friendInfo = results.map(result => ({id: result.friend_id, state: result.state}))
        var toSendInfo = [];

        if(friendInfo.length === 0) res.json({ toSendInfo })

        // Loop through each friend ID and query their information
        friendInfo.forEach(friend => {
            const friendId = friend.id
            const friendState = friend.state

            fetch(`http://localhost:5000/get-userdata/${friendId}`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        let toSendFriend = data
                        toSendFriend['state'] = friendState
                        toSendInfo.push(toSendFriend);
                    }
                    if (toSendInfo.length === friendInfo.length) {
                        res.json({ friendsInfo: toSendInfo });
                    }
                })
                .catch((error) => console.log("error getting userdata in friends query: ", error))
        });
    });
});

module.exports = router;