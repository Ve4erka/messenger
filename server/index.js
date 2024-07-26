const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 5000;

let messages = [];

app.use(cors({
  origin: 'http://localhost:3000',
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Сервер запущен');
});


app.post('/message', (req, res) => {
  const { text } = req.body;
  console.log(messages);
  if (messages.length >= 9) {
    messages.shift();
  }
  const newMessage = { id: uuidv4(), text };
  messages.push(newMessage);

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'NEW_MESSAGE', message: newMessage }));
    }
  });

  res.status(201).json(newMessage);
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});