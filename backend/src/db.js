import { parse } from 'dotenv';
import pg from 'pg';
const { Pool } = pg;
const poolConfig = {
  user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // close and remove clients which have been idle > 30 seconds
};

const pool = new Pool(poolConfig);
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Optional: Verbindung beim App-Start testen
export async function testDbConnection() {
    try {
     const client = await pool.connect();
     console.log('Database connection pool connected successfully!');
     client.release(); // Verbindung zurückgeben
    } catch (err) {
     console.error('Database connection pool initial connection error:', err);
     // Handle error: Log, exit?
     // process.exit(1);
    }}
    // Beim API-Start aufrufen:
    // testDbConnection();

export const query = (text, params) => { pool.query(text, params) };