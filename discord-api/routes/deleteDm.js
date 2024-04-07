const express = require('express')
const db = require('../db')
const router = express.Router()

router.delete('/delete-dm/:userID/:dmId', (req, res) => {
    const { userID, dmId } = req.params
    const userId =  Number(userID)

    const authQuery = `SELECT sender_id FROM dms WHERE dm_id = ?`
    db.query(authQuery, [dmId], (error, authResults) => {
        if (error) {
        console.error('Error adding dms', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
        }
        if (userId !== authResults[0].sender_id){
            console.error('No permession to delete dm!', error);
            res.status(500).json({ error: 'No permession to delete dm!' });
            return;
        }

        const deleteDmsQuery = `DELETE FROM dms WHERE dm_id = ?`
        db.query(deleteDmsQuery, [dmId], (error, deleteResults) => {
            if (error) {
            console.error('Error adding dms', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
            }
            console.log("Dm deleted successfully!")
            res.status(200).json({msg: "dms deleted successfully!"})
        });
    });
});

module.exports = router;