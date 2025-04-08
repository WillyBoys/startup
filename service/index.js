import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { getUserByUsername, getUserByEmail, addUser } from './db.js';

dotenv.config();

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const activeUsers = new Set(); // Track active users

app.use(express.json());
app.use(express.static('public')); // Serve static files
app.use(cookieParser());
app.use(cors({ credentials: true }));

const sessions = {}; // Track logged-in users

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

app.get("/", (req, res) => {
  res.send("I'm watching you!");
});

// Authentication Routes
apiRouter.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  const existingUser = await getUserByUsername(username);
  const existingEmail = await getUserByEmail(email);

  if (existingUser || existingEmail) {
    return res.status(400).json({ error: 'Username or email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await addUser({ username, password: hashedPassword, email });

  res.json({ success: true });
});

apiRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await getUserByUsername(username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const sessionId = uuidv4();
  sessions[sessionId] = username;
  res.cookie('sessionId', sessionId, { httpOnly: true });
  res.json({ success: true });
});

apiRouter.post('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  delete sessions[sessionId];
  res.clearCookie('sessionId');
  res.json({ success: true });
});

apiRouter.get('/session', (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessions[sessionId]) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json({ username: sessions[sessionId] });
});

// WebSocket Server for Real-Time Chat
const wss = new WebSocketServer({ port: 4001 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {

      console.log("Received message:", message);

      const data = JSON.parse(message);

      if (data.type === 'join' && data.username) {
        activeUsers.add(data.username);
        broadcastUserList();
      }

      if (data.type === 'leave' && data.username) {
        activeUsers.delete(data.username);
        broadcastUserList();
      }

      if (data.type === 'message') {
        const messageToSend = {
          type: 'message',
          text: data.text,
          senderName: data.senderName
        };

        console.log("Broadcasting message:", messageToSend);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messageToSend));
          }
        });
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  });

  ws.on('close', () => {
    // Could implement cleanup logic based on sessions if needed
  });
});

function broadcastUserList() {
  const userList = Array.from(activeUsers).map(name => ({ name }));
  const message = JSON.stringify({ type: 'updateUsers', users: userList });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}


app.listen(port, () => {
  console.log(`Chat service running on http://localhost:${port}`);
});