import { request } from 'websocket'
import logger from 'jet-logger'

// **** Variables **** //


// **** Functions **** //

function _originIsAllowed(origin: string) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

function requestHandler(request: request) {
    if (!_originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        logger.info('Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    const connection = request.accept(null, request.origin);
    logger.info('Connection ' + connection.remoteAddress + ' accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            logger.info('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            logger.info('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        logger.info('Peer ' + connection.remoteAddress + ' disconnected.');
    });
}

// **** Exports **** //

export { requestHandler };
