const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
require('dotenv').config();

const httpBindHost = process.env.HTTP_SERVER_BIND || '0.0.0.0';
const httpPort = Number(process.env.HTTP_SERVER_PORT || 54323);
const stylesRoute = normalizeRoute(process.env.HTTP_SERVER_STYLES_ROUTE || '/styles.json');
const stylesPath = path.resolve(__dirname, 'styles.json');

function normalizeRoute(route) {
  if (typeof route !== 'string') {
    return '/styles.json';
  }

  const trimmedRoute = route.trim();
  if (trimmedRoute.length === 0) {
    return '/styles.json';
  }

  return trimmedRoute.startsWith('/') ? trimmedRoute : `/${trimmedRoute}`;
}

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

function writeJsonResponse(response, statusCode, body, sendBody = true) {
  const bodyText = JSON.stringify(body);

  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(bodyText, 'utf8'),
    'Cache-Control': 'no-store',
  });

  if (!sendBody) {
    response.end();
    return;
  }

  response.end(bodyText);
}

const httpServer = http.createServer((request, response) => {
  const requestMethod = request.method || 'GET';
  const requestPath = (request.url || '/').split('?')[0];
  const sendBody = requestMethod !== 'HEAD';

  if (requestMethod !== 'GET' && requestMethod !== 'HEAD') {
    writeJsonResponse(
      response,
      405,
      {
        error: 'Method Not Allowed',
        allowedMethods: ['GET', 'HEAD'],
      },
      sendBody
    );
    return;
  }

  if (requestPath !== stylesRoute) {
    writeJsonResponse(
      response,
      404,
      {
        error: 'Not Found',
        availableRoute: stylesRoute,
      },
      sendBody
    );
    return;
  }

  const stylesPayload = readStylesPayload();
  if (!stylesPayload.ok) {
    console.error(stylesPayload.error);
    writeJsonResponse(
      response,
      500,
      {
        error: stylesPayload.error,
      },
      sendBody
    );
    return;
  }

  response.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': stylesPayload.byteLength,
    'Cache-Control': 'no-store',
  });

  if (!sendBody) {
    response.end();
    return;
  }

  response.end(stylesPayload.stylesMessage);
});

httpServer.on('error', (error) => {
  console.error(`HTTP server error: ${error.message}`);
});

httpServer.listen(httpPort, httpBindHost, () => {
  console.log(`HTTP styles server listening on http://${httpBindHost}:${httpPort}${stylesRoute}`);
});
