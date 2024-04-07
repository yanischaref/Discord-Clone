const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config()

const host = process.env.HOST
const user = process.env.USER
const password = process.env.PASSWORD
const database = process.env.DATABASE

const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
})

db.connect((err) => {
    if (err) {
        console.log("Error Connecting to MySQL DB: ", err)
        return
    }
    console.log("Connected to MySQL DB.")
})

module.exports = db