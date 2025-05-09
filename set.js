const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('buses.db');

db.serialize(() => {
  // Create buses table
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

  // Insert sample buses
  const stmt = db.prepare(`INSERT INTO buses 
    (company, plate, from_location, to_location, departure, arrival, seats, price, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
  const sampleBuses = [
    ["DreamLine Express", "KDA 453F", "Lobatse", "Goodhope", "06:00 AM", "01:30 PM", 48, 25, "https://via.placeholder.com/60"],
    ["TransAfrica Coaches", "KCE 876H", "Gaborone", "Harare", "09:00 AM", "04:00 PM", 42, 30, "https://via.placeholder.com/60"],
    ["Skyline Travel", "ABC 123X", "Mochudi", "Bokaa", "07:00 AM", "02:00 PM", 50, 20, "https://via.placeholder.com/60"],
    ["Pula Coaches", "XYZ 789K", "Francistown", "Maun", "08:30 AM", "05:00 PM", 45, 35, "https://via.placeholder.com/60"]
  ];

  sampleBuses.forEach(bus => stmt.run(bus));
  stmt.finalize();

  // Create tickets table
  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus TEXT,
    from_location TEXT,
    to_location TEXT,
    date TEXT,
    seat TEXT,
    status TEXT
  )`);

  // Insert sample ticket
  db.run(`INSERT INTO tickets (bus, from_location, to_location, date, seat, status)
          VALUES (?, ?, ?, ?, ?, ?)`,
    ["DreamLine Express", "Lobatse", "Goodhope", "2025-04-12", "8", "expired"]
    
  );

  console.log("Buses and tickets tables created with sample data.");
});

db.close();
