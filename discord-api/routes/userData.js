const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/get-userdata/:userID', (req, res) => {
    const userId = req.params.userID
    const userQuery = `SELECT user_id ,username, name, subscription, profile_picture, banner, status, is_dm_open, created_at, about_me, quote FROM users WHERE user_id = ?`

    db.query(userQuery, [userId], (err, results) => {
        if (err) {
            return
        }
        var toSendData = results[0]
        const badgesQuery = `
        SELECT badges.name, badges.url
        FROM user_badges
        JOIN badges ON user_badges.badge_id = badges.badge_id
        WHERE user_badges.user_id = ?
        `
        db.query(badgesQuery, [userId], (err, badgesResults) => {
            if (err) {
                console.log("errerror: ", err)
                res.status(500).json({ error: `Error querying MySQL ${err}` });
                return
            }
            toSendData['badges'] = badgesResults
            res.status(200).json(toSendData)
            return
        })
    });
});

module.exports = router;