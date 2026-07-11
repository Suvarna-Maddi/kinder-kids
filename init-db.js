import mysql from 'mysql2/promise';

async function init() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
  });

  try {
    console.log("Connected to MySQL successfully!");
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS kinderkidsspace;`);
    console.log("Database kinderkidsspace ensured.");
    
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
    console.log("Table users ensured.");
    
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await connection.end();
  }
}

init();
