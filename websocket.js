const net = require('node:net');
const readline = require('node:readline');
require('dotenv').config();

const bindHost = process.env.SOCKET_SERVER_BIND || '0.0.0.0';
const port = Number(process.env.SOCKET_SERVER_PORT || 54320);
const welcomeMessage = process.env.SOCKET_MESSAGE || 'Hello from the Node socket server';
const clients = new Set();

function createPayload(type, message, extra = {}) {
  return JSON.stringify({
    type,
    message,
    sentAt: new Date().toISOString(),
    ...extra,
  }) + '\n';
}

function sendMessage(socket, type, message, extra = {}) {
  socket.write(createPayload(type, message, extra));
}

function broadcastMessage(message) {
  let sentCount = 0;
  for (const client of clients) {
    if (client.destroyed) {
      clients.delete(client);
      continue;
    }

    sendMessage(client, 'server-message', message);
    sentCount += 1;
  }

  console.log(`Broadcasted message to ${sentCount} client(s).`);
}

function processIncomingData(socket, chunk) {
  socket.pendingData += chunk;

  let newlineIndex = socket.pendingData.indexOf('\n');
  while (newlineIndex !== -1) {
    const messageText = socket.pendingData.slice(0, newlineIndex).trim();
    socket.pendingData = socket.pendingData.slice(newlineIndex + 1);

    if (messageText.length > 0) {
      console.log(`Received from ${socket.clientLabel}: ${messageText}`);

      try {
        const payload = JSON.parse(messageText);
        console.log('Parsed payload:', payload);
      } catch (error) {
        console.log(`Message was not JSON: ${error.message}`);
      }
    }

    newlineIndex = socket.pendingData.indexOf('\n');
  }
}

const server = net.createServer((socket) => {
  socket.setEncoding('utf8');
  socket.setNoDelay(true);
  socket.pendingData = '';
  socket.clientLabel = `${socket.remoteAddress}:${socket.remotePort}`;

  clients.add(socket);
  console.log(`Roku connected from ${socket.clientLabel}`);

  sendMessage(socket, 'welcome', welcomeMessage, {
    connectedClients: clients.size,
  });

  socket.on('data', (chunk) => {
    processIncomingData(socket, chunk);
  });

  socket.on('close', () => {
    clients.delete(socket);
    console.log(`Client disconnected: ${socket.clientLabel}`);
  });

  socket.on('error', (error) => {
    clients.delete(socket);
    console.error(`Socket error for ${socket.clientLabel}: ${error.message}`);
  });
});

server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
});

server.listen(port, bindHost, () => {
  console.log(`TCP socket server listening on ${bindHost}:${port}`);
  console.log('Type a message and press Enter to broadcast it to connected Roku clients.');
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (line) => {
  const message = line.trim();
  if (message.length === 0) {
    return;
  }

  broadcastMessage(message);
});
