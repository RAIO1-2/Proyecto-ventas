const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'my-shop';

export const LIMIT_PER_PAGE = 20;

export const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(DB_NAME);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Failed to connect to database');
    }
}

export async function closeConnection() {
    try {
        await client.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw new Error('Failed to close the database connection');
    }
}