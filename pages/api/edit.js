import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data/users.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, username, password, address, profilePicture } = req.body;

    // Initialize users array
    let users = [];

    // Attempt to read existing users from the JSON file
    try {
      const data = readFileSync(usersFilePath, 'utf-8');
      if (data) {
        users = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading users file:', error);
      return res.status(500).json({ message: 'Error reading users file' });
    }

    // Find the user to update
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user information
    const updatedUser = {
      ...users[userIndex],
      username: username || users[userIndex].username,
      password: password ? await bcrypt.hash(password, 10) : users[userIndex].password, // Only hash if a new password is provided
      address: address || users[userIndex].address,
      profilePicture: profilePicture || users[userIndex].profilePicture,
    };

    // Update the users array with the modified user
    users[userIndex] = updatedUser;

    // Save updated users to JSON file
    try {
      writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error writing users file:', error);
      return res.status(500).json({ message: 'Error saving user data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
