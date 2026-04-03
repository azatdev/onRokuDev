const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
require('dotenv').config();

const socketBindHost = process.env.SOCKET_SERVER_BIND || '0.0.0.0';
const socketPort = Number(process.env.SOCKET_SERVER_PORT || 54320);
const welcomeMessage = process.env.SOCKET_MESSAGE || 'Hello from the Node socket server';
const stylesPath = path.resolve(__dirname, 'styles.json');
const clients = new Set();

function readStylesPayload() {
  let stylesMessage = '';

  try {
    stylesMessage = fs.readFileSync(stylesPath, 'utf8').trim();
  } catch (error) {
    return {
      ok: false,
      error: `Unable to read styles payload from ${stylesPath}: ${error.message}`,
    };
  }

  if (stylesMessage.length === 0) {
    return {
      ok: false,
      error: `Styles payload at ${stylesPath} is empty.`,
    };
  }

  return {
    ok: true,
    stylesMessage,
    byteLength: Buffer.byteLength(stylesMessage, 'utf8'),
  };
}

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

function broadcastPayload(type, message, extra = {}, excludeSocket = null) {
  let sentCount = 0;

  for (const client of clients) {
    if (client.destroyed) {
      clients.delete(client);
      continue;
    }

    if (client === excludeSocket) {
      continue;
    }

    sendMessage(client, type, message, extra);
    sentCount += 1;
  }

  console.log(`Broadcasted "${type}" to ${sentCount} client(s).`);
  return sentCount;
}

function broadcastStylesUpdate(excludeSocket = null) {
  const stylesPayload = readStylesPayload();
  if (!stylesPayload.ok) {
    console.error(stylesPayload.error);
    return false;
  }

  broadcastPayload(
    'styles-update',
    stylesPayload.stylesMessage,
    {
      filePath: 'build/styles.json',
      messageFormat: 'json-string',
      byteLength: stylesPayload.byteLength,
    },
    excludeSocket
  );

  return true;
}

function handleIncomingPayload(socket, payload) {
  if (payload?.type === 'styles-update-request') {
    console.log(`Received styles-update request from ${socket.clientLabel}`);
    return broadcastStylesUpdate(socket);
  }

  return false;
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
        handleIncomingPayload(socket, payload);
      } catch (error) {
        console.log(`Message was not JSON: ${error.message}`);
      }
    }

    newlineIndex = socket.pendingData.indexOf('\n');
  }
}

const socketServer = net.createServer((socket) => {
  socket.setEncoding('utf8');
  socket.setNoDelay(true);
  socket.pendingData = '';
  socket.clientLabel = `${socket.remoteAddress}:${socket.remotePort}`;

  clients.add(socket);
  console.log(`Client connected from ${socket.clientLabel}`);

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

socketServer.on('error', (error) => {
  console.error(`Socket server error: ${error.message}`);
});

socketServer.listen(socketPort, socketBindHost, () => {
  console.log(`TCP socket server listening on ${socketBindHost}:${socketPort}`);
});
