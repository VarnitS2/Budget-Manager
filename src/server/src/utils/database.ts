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
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        multiplier INTEGER NOT NULL
      );
    `);
    logger.success(`categories table check passed`);

    await db.run(`
      CREATE TABLE IF NOT EXISTS merchants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
        categoryID INTEGER REFERENCES categories(id) NULL
      );
    `);
    logger.success(`merchants table check passed`);

    await db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        merchantID INTEGER REFERENCES merchants(id),
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
