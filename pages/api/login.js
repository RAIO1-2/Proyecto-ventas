import { readFileSync } from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data/users.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const users = JSON.parse(readFileSync(usersFilePath, 'utf-8'));
    const user = users.find(user => user.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Internal server error: JWT_SECRET not set' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
