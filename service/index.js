import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(express.static('public')); // Serve static files
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.get("/", (req, res) => {
  res.send("I'm watching you!");
});

const users = {};   // Store user credentials (in-memory for now)
const sessions = {}; // Track logged-in users

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Authentication Routes
apiRouter.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  if (users[username]) return res.status(400).json({ error: 'User already exists' });

  users[username] = { password: bcrypt.hashSync(password, 10), email };
  res.json({ success: true });
});

apiRouter.post('/login', (req, res) => {
  console.log("Login attempt:", req.body);
  const username = req.body.username;
  const password = req.body.password;
  if (!users[username] || !bcrypt.compareSync(password, users[username].password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

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
    wss.clients.forEach(client => client.send(message.toString()));
  });
});

app.listen(port, () => {
  console.log(`Chat service running on http://localhost:${port}`);
});