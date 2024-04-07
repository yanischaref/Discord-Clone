const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/get-userdata/:userID', (req, res) => {
    const userId = req.params.userID
    userQuery = `SELECT username, name, profile_picture, status FROM users WHERE user_id = ?`

    db.query(userQuery, [userId], (err, results) => {
        if (err) {
            console.log("Error quering user from DB")
            res.status(500).json({ error: 'Error querying MySQL' });
            return
        }
        res.status(200).json(results[0])
    });
});

module.exports = router;