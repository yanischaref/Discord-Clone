const express = require('express')
const db = require('../db')
const router = express.Router()

router.post('/add-dm/:senderId/:receiverId', (req, res) => {
    console.log("Hello there!")
    const { sender_id, receiver_id, dm_body } = req.body
    const addDmsQuery = `
    INSERT INTO dms (sender_id, receiver_id, dm_body)
    VALUES (?, ?, ?);
    `
    db.query(addDmsQuery, [sender_id, receiver_id, dm_body], (error, results) => {
        if (error) {
            console.error('Error adding dms', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        console.log("dm added successfully to DB!")
        res.status(200).json({ msg: "dms added successfully!" })
    });
});

module.exports = router;