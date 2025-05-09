const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (index.html, css, js)

// Use shared buses.db (relative to project root)
const dbPath = path.resolve(__dirname, '../buses.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit if the database connection fails
  }
});

// General error handler for unexpected errors
function handleError(err, res) {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
}

// Get all buses
app.get('/api/buses', (req, res) => {
  db.all('SELECT * FROM buses', [], (err, rows) => {
    if (err) return handleError(err, res);
    res.json(rows);
  });
});

// Add new bus
app.post('/api/buses', (req, res) => {
  const { company, plate, from_location, to_location, departure, arrival, seats, price, image } = req.body;
  
  // Validate input data
  if (!company || !plate || !from_location || !to_location || !departure || !arrival || !seats || !price || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = `INSERT INTO buses (company, plate, from_location, to_location, departure, arrival, seats, price, image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(stmt, [company, plate, from_location, to_location, departure, arrival, seats, price, image], function(err) {
    if (err) return handleError(err, res);
    res.json({ id: this.lastID, message: 'Bus added successfully' });
  });
});
// DELETE bus by ID
app.delete('/api/buses/:id', (req, res) => {
  const busId = parseInt(req.params.id);

  if (!busId || isNaN(busId)) {
    return res.status(400).json({ error: 'Invalid bus ID' });
  }

  db.run('DELETE FROM buses WHERE id = ?', [busId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Bus not found' });
    res.json({ message: 'Bus deleted successfully' });
  });
});

// Get all tickets
app.get('/api/tickets', (req, res) => {
  db.all('SELECT * FROM tickets', [], (err, rows) => {
    if (err) return handleError(err, res);
    res.json(rows);
  });
});

// Delete ticket
app.delete('/api/tickets/:id', (req, res) => {
  const ticketId = req.params.id;

  // Validate ticketId
  if (!ticketId || isNaN(ticketId)) {
    return res.status(400).json({ error: 'Invalid ticket ID' });
  }

  db.run('DELETE FROM tickets WHERE id = ?', [ticketId], function(err) {
    if (err) return handleError(err, res);
    if (this.changes === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ message: 'Ticket deleted successfully' });
  });
});

// Calculate total revenue
app.get('/api/revenue', (req, res) => {
  db.all('SELECT price FROM tickets JOIN buses ON tickets.bus = buses.company', [], (err, rows) => {
    if (err) return handleError(err, res);

    const totalRevenue = rows.reduce((sum, row) => sum + row.price, 0);
    res.json({ totalRevenue });
  });
});

// Serve the admin HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.error('Server start error:', err.message);
    process.exit(1);
  }
  console.log(`Admin server running on http://localhost:${PORT}`);
});
