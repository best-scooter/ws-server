// /**
//  * Setup server.
//  */

import WebSocket from 'websocket';
import http from 'http';

import { requestHandler } from './models/requestHandler';

// // **** Setup **** //

const httpServer = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

const wsServer = new WebSocket.server({
    httpServer: httpServer,
    autoAcceptConnections: false
})

wsServer.on('request', requestHandler);

// // **** Export default **** //

export { httpServer, wsServer };
