import express from 'express';
import mysql from 'mysql2';


const app = express();
const port = process.env.NODE_DOCKER_PORT || 6969;

let connect = mysql.createConnection({
    host: process.env.DB_HOST || "mysql",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

connect.connect(function (err) {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log("connected");
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

