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
        name TEXT NOT NULL UNIQUE
      );`,
      (err) => {
        if (err) {
          console.log(`${err}`);
        } else {
          console.log("merchants table created");
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS transaction_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL UNIQUE
      );`,
      (err) => {
        if (err) {
          console.log(`${err}`);
        } else {
          console.log("transaction-types table created");
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        merchantID INTEGER REFERENCES merchants(id),
        typeID INTEGER REFERENCES transaction_types(id),
        amount DECIMAL(5,2) NOT NULL,
        date DATE NOT NULL
      );`,
      (err) => {
        if (err) {
          console.log(`${err}`);
        } else {
          console.log("transactions table created");
        }
      }
    );
  }
});

export default db;
