const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/get-user-by-username/:username', (req, res) => {
    const { username } = req.params

    const getUserId = `SELECT user_id FROM users WHERE username = ?`
    db.query(getUserId, [username], (error, result) => {
        if (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.length === 0) {
            res.status(500).json({ result: 'no user found!' });
            return
        }
        const userid = result[0].user_id
        res.status(200).json({ userid });
    })
});

module.exports = router;