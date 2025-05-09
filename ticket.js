const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('buses.db');

// Create buses table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS buses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT,
    plate TEXT,
    from_location TEXT,
    to_location TEXT,
    departure TEXT,
    arrival TEXT,
    seats INTEGER,
    price REAL,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus TEXT,
    from_location TEXT,
    to_location TEXT,
    date TEXT,
    seat TEXT,
    status TEXT
  )`);

  // Sample buses
  const insertBus = db.prepare(`
    INSERT INTO buses (company, plate, from_location, to_location, departure, arrival, seats, price, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBus.run("DreamLine Express", "KDA 453F", "Lobatse", "Goodhoe", "06:00 AM", "01:30 PM", 48, 25, "https://via.placeholder.com/60");
  insertBus.run("TransAfrica Coaches", "KCE 876H", "Gaborone", "Harare", "09:00 AM", "04:00 PM", 42, 30, "https://via.placeholder.com/60");
  insertBus.run("Skyline Travel", "ABC 123X", "Mochudi", "Bokaa", "07:00 AM", "02:00 PM", 50, 20, "https://via.placeholder.com/60");

  insertBus.finalize();

  // Sample ticket
  db.run(`
    INSERT INTO tickets (bus, from_location, to_location, date, seat, status)
    VALUES ('Katlo Logs', 'Kanana', 'Selipe Phikwe', '2025-04-12', '8', 'expired')
  `);

  console.log("Database initialized with sample data.");
});

db.close();
