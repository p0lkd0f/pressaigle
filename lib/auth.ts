import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: string;
  email: string;
  password: string;
}

// In-memory user store (replace with database in production)
let users: User[] = [];

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const user: User = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
  };
  users.push(user);
  return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return users.find(u => u.email === email) || null;
}

export async function findUserById(id: string): Promise<User | null> {
  return users.find(u => u.id === id) || null;
}

