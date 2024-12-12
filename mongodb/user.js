const { connectToDatabase, closeConnection } = require('./database');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function authenticateUser(email, password) {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email });

        await closeConnection();

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('Internal server error: JWT_SECRET not set');
        }

        const token = jwt.sign({ id: user.id, rank: user.rank }, process.env.JWT_SECRET, { expiresIn: '30d' });
        return { token: token, userId: user.id, rank: user.rank };
    } catch (error) {
        throw error;
    }
}

export async function createUser(email, password) {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the next auto-incremented ID
    const lastUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = lastUser.length > 0 ? lastUser[0].id + 1 : 1;

    // Create a new user object
    const newUser = {
        id: nextId,
        email,
        password: hashedPassword,
        address: 'none',
        rank: 'member',
    };

    // Insert the new user into the database
    const result = await usersCollection.insertOne(newUser);

    await closeConnection();

    if (!result.acknowledged) {
        throw new Error('User creation failed');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id, rank: newUser.rank }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return { token: token, userId: newUser.id };
}