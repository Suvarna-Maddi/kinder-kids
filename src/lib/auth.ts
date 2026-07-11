import { createServerFn } from '@tanstack/react-start';
import bcrypt from 'bcryptjs';
import { query } from './db.server';

export const registerUser = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const { username, email, phone_number, password } = data;

    if (!username || !email || !phone_number || !password) {
      throw new Error("All fields are required.");
    }

    try {
      // Check if user already exists
      const existingUsers = await query(
        `SELECT id FROM users WHERE email = ?`,
        [email]
      ) as any[];

      if (existingUsers.length > 0) {
        throw new Error("A user with this email already exists.");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Insert user
      const result = await query(
        `INSERT INTO users (username, email, phone_number, password_hash) VALUES (?, ?, ?, ?)`,
        [username, email, phone_number, password_hash]
      ) as any;

      return { success: true, message: "User registered successfully!", userId: result.insertId };
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "An error occurred during registration.");
    }
  });

export const loginUser = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    try {
      const users = await query(
        `SELECT id, password_hash, username FROM users WHERE email = ?`,
        [email]
      ) as any[];

      if (users.length === 0) {
        throw new Error("Invalid email or password.");
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        throw new Error("Invalid email or password.");
      }

      return { success: true, message: "Logged in successfully!", userId: user.id, username: user.username };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "An error occurred during login.");
    }
  });
