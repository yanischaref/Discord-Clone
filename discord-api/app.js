const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cors = require('cors');

const app = express()
dotenv.config()
const port = process.env.PORT

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Import routes
const auth = require('./routes/auth.js');
const dmsData = require('./routes/dmsData.js');
const friendsData = require('./routes/friendsData.js');
const userData = require('./routes/userData.js');
const deleteDm = require('./routes/deleteDm.js');
const addDm = require('./routes/addDm.js');
const allUsers = require('./routes/allUsers.js');
const addFriend = require('./routes/addFriend.js');
const freindsPending = require('./routes/friendsPending.js');

const http = require('http');
const initializeSocket = require('./routes/socketRouter');

const server = http.createServer(app);
initializeSocket(server);

/* Routes */
app.use('/', auth);
app.use('/', dmsData);
app.use('/', friendsData);
app.use('/', userData);
app.use('/', deleteDm);
app.use('/', addDm);
app.use('/', addFriend);
app.use('/', allUsers);
app.use('/', freindsPending);

server.listen(port, () => {
    console.log(`Discord Api is running on http://localhost:${port}`)
})
