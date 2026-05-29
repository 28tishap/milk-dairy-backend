const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'amul_dairy_lite'
});

connection.connect((err) => {
    if (err) {
        console.log('Database connection failed');
    } else {
        console.log('Connected to MySQL');
    }
});

module.exports = connection;