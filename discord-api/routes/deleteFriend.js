const express = require('express')
const db = require('../db')
const router = express.Router()

router.delete('/delete-friend', (req, res) => {
    const { userId, friendId } = req.body
    const deleteQuery = 'DELETE FROM friends WHERE user_id IN(?, ?) AND friend_id IN(?, ?)'

    db.query(deleteQuery, [userId, friendId, userId, friendId], (error, deleteResults) => {
        if (error) {
            console.error('Error deleting friend', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json({ msg: "Friend deleted successfully!" })
    });
});

module.exports = router;