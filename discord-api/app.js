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
const openedDmsData = require('./routes/openedDmsData.js');
const friendsData = require('./routes/friendsData.js');
const userData = require('./routes/userData.js');
const getUserByUsername = require('./routes/getUserByUsername.js');
const deleteDm = require('./routes/deleteDm.js');
const addDm = require('./routes/addDm.js');
const allUsers = require('./routes/allUsers.js');
const addFriend = require('./routes/addFriend.js');
const deleteFriend = require('./routes/deleteFriend.js');
const acceptFriend = require('./routes/acceptFriend.js');

const http = require('http');
const initializeSocket = require('./routes/socketRouter');

const server = http.createServer(app);
initializeSocket(server);

/* Routes */
app.use('/', auth);
app.use('/', dmsData);
app.use('/', openedDmsData);
app.use('/', friendsData);
app.use('/', userData);
app.use('/', getUserByUsername);
app.use('/', deleteDm);
app.use('/', addDm);
app.use('/', addFriend);
app.use('/', deleteFriend);
app.use('/', allUsers);
app.use('/', acceptFriend);

server.listen(port, () => {
    console.log(`Discord Api is running on http://localhost:${port}`)
})
