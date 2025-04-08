import { MongoClient } from 'mongodb';
import config from '../dbConfig.json' with { type: 'json' };

const encodedPassword = encodeURIComponent(config.password);
const url = `mongodb+srv://${config.username}:${encodedPassword}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('skibidichat');
const userCollection = db.collection('user');

// Test connection
(async function testConnection() {
    try {
        await db.command({ ping: 1 });
        console.log(`Connected to database`);
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
    }
})();

export function getUser(email) {
    return userCollection.findOne({ email: email });
}

export function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

export async function addUser(user) {
    await userCollection.insertOne(user);
}

export async function updateUser(user) {
    await userCollection.updateOne({ email: user.email }, { $set: user });
}

export function getUserByUsername(username) {
    return userCollection.findOne({ username });
}

export function getUserByEmail(email) {
    return userCollection.findOne({ email });
}  
