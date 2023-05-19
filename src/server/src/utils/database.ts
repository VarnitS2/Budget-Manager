import { Database } from "sqlite3";

const DB_NAME = "db.sqlite";

const DB_LOG_PREFIX = "[db]";
const FG_RED = "\x1b[31m";
const FG_GREEN = "\x1b[32m";
const FG_RESET = "\x1b[0m";

const db = new Database(DB_NAME, (err) => {
  if (err) {
    // Cannot open database
    console.error(`${FG_RED}${DB_LOG_PREFIX} ${err.message}${FG_RESET}`);
    throw err;
  } else {
    console.log(`${FG_GREEN}${DB_LOG_PREFIX} connected to database${FG_RESET}`);
    db.run(
      `CREATE TABLE IF NOT EXISTS merchants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );`,
      (err) => {
        if (err) {
          console.log(`${err}`);
        } else {
          console.log(`${FG_GREEN}${DB_LOG_PREFIX} merchants table check passed${FG_RESET}`);
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
          console.log(
            `${FG_GREEN}${DB_LOG_PREFIX} transaction-types table check passed${FG_RESET}`
          );
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
          console.log(`${FG_GREEN}${DB_LOG_PREFIX} transactions table check passed${FG_RESET}`);
        }
      }
    );
  }
});

export default db;
