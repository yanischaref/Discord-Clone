const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db')
const router = express.Router()


router.post('/register', (req, res) => {
  const { email, username, name, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? OR email = ?`;

  db.query(query, [username, email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const existingEmail = results.find(user => user.email === email);
    const existingUsername = results.find(user => user.username === username);

    if (existingEmail) {
      console.log("Email Exists")
      res.status(400).json({ error: 'Email already in use' });
    } else if (existingUsername) {
      console.log("user Exists")
      res.status(400).json({ error: 'Username already in use' });
    } else {
      // Neither email nor username exists, proceed to add user
      const newUserQuery = `INSERT INTO users (username, name, email, password)
                                VALUES (?, ?, ?, ?);`
      db.query(newUserQuery, [username, name, email, password], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(400).json({ message: 'User Not Found!' });
      return;
    }
    // const token = jwt.sign({ user_id: results[0].user_id }, 'jwtkey');
    const { password, ...other } = results[0];
    res.status(201).json({ user: other });
  });
});

module.exports = router;
