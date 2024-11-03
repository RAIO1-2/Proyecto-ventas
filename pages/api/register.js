import { writeFileSync, readFileSync } from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data/users.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, username } = req.body;

    // Initialize users array
    let users = [];

    // Attempt to read existing users from the JSON file
    try {
      const data = readFileSync(usersFilePath, 'utf-8');
      if (data) {
        users = JSON.parse(data);
      }
    } catch (error) {
      // If the file does not exist or cannot be read, we initialize it as an empty array
      console.error('Error reading users file:', error);
      users = [];
    }

    // Check for existing user
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user object
    const newUser = {
      id: Date.now(), // Simple ID, you can use a more robust solution
      email,
      password: hashedPassword,
      username,
      profilePicture: 'guest.png',
      address: 'none',
      rank: 'member'
    };

    // Save new user to JSON file
    users.push(newUser);
    writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
