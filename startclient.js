const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const busdb = new sqlite3.Database('buses.db');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the login page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// Register
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  console.log("god:",email)
  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
  db.run(query, [email, hash], function(err) {
    if (err) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.json({ message: 'Registration successful' });
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
   console.log(email)
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ message: 'Login successful' });
  });
});



///dash logic
// API endpoint to get all buses
app.get('/api/buses', (req, res) => {
  busdb.all("SELECT * FROM buses", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
          console.log(err.message)
      return;
    }
    res.json(rows);
    console.log(rows)
  });
});

//get tickets
app.get('/api/tickets', (req, res) => {
  busdb.all("SELECT * FROM tickets", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

//add new ticket
app.post('/api/tickets', (req, res) => {
  const { bus, from_location, to_location, date, seat, status } = req.body;
  console.log('body:',req.body)
  const sql = `
    INSERT INTO tickets (bus, from_location, to_location, date, seat, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  busdb.run(sql, [bus, from_location, to_location, date, seat, status], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Ticket booked successfully', id: this.lastID });
  });
});







// Add a new bus
app.post("/api/buses", (req, res) => {
  const { company, plate, from, to, departure, arrival, seats, price, image } = req.body;
  const sql = `
    INSERT INTO buses (company, plate, from, to, departure, arrival, seats, price, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  busdb.run(sql, [company, plate, from, to, departure, arrival, seats, price, image], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Delete a bus
app.delete("/api/buses/:id", (req, res) => {
  const id = req.params.id;
  busdb.run("DELETE FROM buses WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Bus deleted" });
  });
});
















app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
