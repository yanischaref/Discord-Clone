const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/get-pending-friends/:userId', (req, res) => {
    usersQuery = `SELECT (user_id, username, name, profile_picture, status) FROM users`

    db.query(usersQuery, (err, results) => {
        if (err) {
            console.log("Error quering users from DB")
            res.status(500).json({ error: 'Error querying MySQL' });
            return
        }
        console.log("users query results: ", results)
        res.status(200).json( {results} )
    });
});

module.exports = router;