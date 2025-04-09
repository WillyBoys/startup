import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import cookie from 'cookie';
import dotenv from 'dotenv';
import { getUserByUsername, getUserByEmail, addUser } from './db.js';

dotenv.config();

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({ credentials: true }));

const sessions = {}; // sessionId -> username
const sessionConnections = new Map(); // sessionId -> Set of sockets

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

app.get("/", (req, res) => {
  res.send("I'm watching you!");
});

// Register
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

// Login
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

// Logout
apiRouter.post('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  delete sessions[sessionId];
  res.clearCookie('sessionId');
  res.json({ success: true });
});

// Session check
apiRouter.get('/session', (req, res) => {
  const sessionId = req.cookies.sessionId;
  const username = sessions[sessionId];

  if (!username) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  res.json({ username });
});

// App Listeniing and assigned to httpService
const httpService = app.listen(port, () => {
  console.log(`Chat service running on http://localhost:${port}`);
});

// WebSocket
const wss = new WebSocketServer({ server: httpService });

wss.on('connection', (ws, req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const sessionId = cookies.sessionId;
  const username = sessions[sessionId];

  if (!sessionId || !username) {
    ws.close();
    return;
  }

  let sockets = sessionConnections.get(sessionId);
  const isNewSession = !sockets;

  if (!sockets) {
    sockets = new Set();
    sessionConnections.set(sessionId, sockets);
  }

  if (sockets.size === 0 && isNewSession) {
    broadcastToAll({
      type: 'system',
      text: `${username} has joined the chat`
    });
  }

  sockets.add(ws);
  broadcastUserList();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'message') {
        broadcastToAll({
          type: 'message',
          text: data.text,
          senderName: username
        });
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  });

  ws.on('close', () => {
    const sockets = sessionConnections.get(sessionId);
    if (!sockets) return;

    sockets.delete(ws);

    if (sockets.size === 0) {
      // Give the user a chance to reconnect (page reload, navigation)
      setTimeout(() => {
        const stillEmpty = !sessionConnections.get(sessionId) || sessionConnections.get(sessionId).size === 0;
        if (stillEmpty) {
          sessionConnections.delete(sessionId);
          broadcastToAll({
            type: 'system',
            text: `${username} has left the chat`
          });
          broadcastUserList();
        }
      }, 4000); // Wait 4 seconds
    }

    broadcastUserList();
  });
});

function broadcastUserList() {
  const users = Array.from(sessionConnections.keys()).map(sessionId => ({
    name: sessions[sessionId]
  }));

  broadcastToAll({ type: 'updateUsers', users });
}

function broadcastToAll(message) {
  const msg = JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(msg);
    }
  });
}