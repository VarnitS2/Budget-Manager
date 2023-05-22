import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Logger } from "./logger";

const DB_NAME = "db.sqlite";
const logger = new Logger();

const dbPromise = (async (): Promise<Database> => {
  try {
    const db = await open({
      filename: DB_NAME,
      driver: sqlite3.Database,
    });
    logger.success(`Connected to ${DB_NAME}`);
    
    await db.run(`
      CREATE TABLE IF NOT EXISTS merchants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);
    logger.success(`merchants table check passed`);

    await db.run(`
      CREATE TABLE IF NOT EXISTS transaction_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL UNIQUE
      );
    `);
    logger.success(`transaction_types table check passed`);

    await db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        merchantID INTEGER REFERENCES merchants(id),
        typeID INTEGER REFERENCES transaction_types(id),
        amount DECIMAL(5,2) NOT NULL,
        date DATE NOT NULL
      );
    `);
    logger.success(`transactions table check passed`);

    return db;
  } catch (err) {
    logger.error(`Error initializing database: ${err}`);
    throw err;
  }
})();

export default dbPromise;
