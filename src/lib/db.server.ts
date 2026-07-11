import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'root',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function setupDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS kinderkidsspace;`);
    
    // Use the database
    await connection.query(`USE kinderkidsspace;`);
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(50) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    connection.release();
    console.log("Database 'kinderkidsspace' and 'users' table are ready.");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

// Call setup automatically when this file is imported (on server start)
setupDatabase();

export async function query(sql: string, params: any[]) {
  const connection = await pool.getConnection();
  await connection.query(`USE kinderkidsspace;`);
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
}
