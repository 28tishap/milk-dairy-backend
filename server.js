const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// ✅ FIXED: serve static files correctly
app.use(express.static(path.join(__dirname, 'public')));

// =====================
// ROOT ROUTE (LOGIN PAGE)
// =====================


app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// =====================
// FARMERS API
// =====================
app.get('/farmers', (req, res) => {
    db.query('SELECT * FROM farmers', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/farmers', (req, res) => {
    const { name, village, phone } = req.body;

    const query = `
        INSERT INTO farmers (name, village, phone)
        VALUES (?, ?, ?)
    `;

    db.query(query, [name, village, phone], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Farmer Added Successfully');
    });
});

// =====================
// MILK API
// =====================
app.get('/milk', (req, res) => {
    db.query('SELECT * FROM milk_collections', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/milk', (req, res) => {
    const {
        farmer_id,
        quantity,
        fat,
        snf,
        shift,
        date
    } = req.body;

    const query = `
        INSERT INTO milk_collections
        (farmer_id, quantity, fat_percentage, snf_percentage, shift_time, collection_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [farmer_id, quantity, fat, snf, shift, date],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Milk Entry Added Successfully');
        }
    );
});

// =====================
// DASHBOARD API
// =====================
app.get('/dashboard', (req, res) => {
    const dashboardData = {};

    db.query('SELECT COUNT(*) AS totalFarmers FROM farmers', (err, farmerResult) => {
        if (err) return res.status(500).send(err);

        dashboardData.totalFarmers = farmerResult[0].totalFarmers;

        db.query('SELECT SUM(quantity) AS totalMilk FROM milk_collections', (err, milkResult) => {
            if (err) return res.status(500).send(err);

            dashboardData.totalMilk = milkResult[0].totalMilk;

            db.query('SELECT SUM(amount) AS totalPayments FROM payments', (err, paymentResult) => {
                if (err) return res.status(500).send(err);

                dashboardData.totalPayments = paymentResult[0].totalPayments;

                res.json(dashboardData);
            });
        });
    });
});

// =====================
// MILK TRENDS API
// =====================
app.get('/milk-trends', (req, res) => {
    const query = `
        SELECT collection_date,
        SUM(quantity) AS total_quantity
        FROM milk_collections
        GROUP BY collection_date
        ORDER BY collection_date
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// =====================
// LOGIN API
// =====================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `
        SELECT * FROM users
        WHERE username = ? AND password = ?
    `;

    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length > 0) {
            res.json({
                success: true,
                user: results[0]
            });
        } else {
            res.json({
                success: false
            });
        }
    });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});