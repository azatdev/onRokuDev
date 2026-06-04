const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
require('dotenv').config();

const httpBindHost = process.env.HTTP_SERVER_BIND || '0.0.0.0';
const httpPort = Number(process.env.HTTP_SERVER_PORT || 54323);
const stylesRoute = normalizeRoute(process.env.HTTP_SERVER_STYLES_ROUTE, '/styles.json');
const stylesUpdateRoute = normalizeRoute(process.env.HTTP_SERVER_STYLES_UPDATE_ROUTE, '/styles-update.json');
const configsRoute = normalizeRoute(process.env.HTTP_SERVER_CONFIGS_ROUTE, '/configs.json');
const stylesPath = path.resolve(__dirname, 'styles.json');
const stylesUpdatePath = path.resolve(__dirname, 'styles-update.json');
const configsPath = path.resolve(__dirname, 'configs.json');

function normalizeRoute(route, fallbackRoute) {
  if (typeof route !== 'string') {
    return fallbackRoute;
  }

  const trimmedRoute = route.trim();
  if (trimmedRoute.length === 0) {
    return fallbackRoute;
  }

  return trimmedRoute.startsWith('/') ? trimmedRoute : `/${trimmedRoute}`;
}

function readJsonPayload(filePath, label) {
  let payloadText = '';

  try {
    payloadText = fs.readFileSync(filePath, 'utf8').trim();
  } catch (error) {
    return {
      ok: false,
      error: `Unable to read ${label} payload from ${filePath}: ${error.message}`,
    };
  }

  if (payloadText.length === 0) {
    return {
      ok: false,
      error: `${label} payload at ${filePath} is empty.`,
    };
  }

  return {
    ok: true,
    payloadText,
    byteLength: Buffer.byteLength(payloadText, 'utf8'),
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
  const routeMap = {
    [stylesRoute]: {
      filePath: stylesPath,
      label: 'Styles',
    },
    [stylesUpdateRoute]: {
      filePath: stylesUpdatePath,
      label: 'Styles update',
    },
    [configsRoute]: {
      filePath: configsPath,
      label: 'Configs',
    },
  };

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

  const routeConfig = routeMap[requestPath];

  if (!routeConfig) {
    writeJsonResponse(
      response,
      404,
      {
        error: 'Not Found',
        availableRoutes: Object.keys(routeMap),
      },
      sendBody
    );
    return;
  }

  const payload = readJsonPayload(routeConfig.filePath, routeConfig.label);
  if (!payload.ok) {
    console.error(payload.error);
    writeJsonResponse(
      response,
      500,
      {
        error: payload.error,
      },
      sendBody
    );
    return;
  }

  response.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': payload.byteLength,
    'Cache-Control': 'no-store',
  });

  if (!sendBody) {
    response.end();
    return;
  }

  response.end(payload.payloadText);
});

httpServer.on('error', (error) => {
  console.error(`HTTP server error: ${error.message}`);
});

httpServer.listen(httpPort, httpBindHost, () => {
  console.log(`HTTP asset server listening on http://${httpBindHost}:${httpPort}`);
  console.log(`Available routes: ${stylesRoute}, ${stylesUpdateRoute}, ${configsRoute}`);
});
