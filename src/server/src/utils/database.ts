import { Database } from "sqlite3";

const DB_NAME = "db.sqlite";

const db = new Database(DB_NAME, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS merchants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transaction-types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        merchantID INTEGER FOREIGN KEY REFERENCES merchants(id),
        typeID INTEGER FOREIGN KEY REFERENCES transaction-types(id),
        amount DECIMAL(5,2) NOT NULL,
        date DATE NOT NULL
      );`,
      (err) => {
        if (err) {
          console.log("Database already initialized.");
        } else {
          console.log("Database successfully initialized.");
        }
      }
    );
  }
});

export default db;
