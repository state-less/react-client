import ReconnectingWebSocket from 'reconnecting-websocket';
import { v4 } from 'uuid';
import baseLogger, { orgLogger } from '../logger';

export const parseSocketResponse = (data) => {
    const { body, statusCode, message } = data;

    if (statusCode !== 200 && statusCode !== 500) {
        throw new Error(message || 'Internal Server Error');
    }

    try {
        const parsed = JSON.parse(body);
        return parsed;
    } catch (e) {
        const message = baseLogger.warning`Error parsing render result ${e}`;
        throw new Error(message);
    }
};

export const emit = (socket, data) => {
    if (Array.isArray(socket)) {
        socket.forEach((socket) => {
            socket.send(JSON.stringify(data));
        });
    } else {
        socket.send(JSON.stringify(data));
    }
};

export const request = async (socket, data) => {
    const id = v4();
    emit(socket, { type: request, ...data, id });
    return new Promise((resolve, reject) => {
        const onResponse = async (event) => {
            const data = await consume(event);
            const json = parseSocketResponse(data);
            if (data.id === id) {
                if (data.type === 'error') {
                    reject(json);
                } else {
                    resolve(json);
                }
                off(socket, 'message', onResponse);
            }
        };
        on(socket, 'message', onResponse);
    });
};

export const on = (socket, event, fn) => {
    if (Array.isArray(socket)) {
        socket.forEach((socket) => {
            socket.addEventListener(event, fn);
        });
    } else {
        socket.addEventListener(event, fn);
    }
};

export const off = (socket, event, fn) => {
    if (Array.isArray(socket)) {
        socket.forEach((socket) => {
            socket.removeEventListener(event, fn);
        });
    } else {
        socket.removeEventListener(event, fn);
    }
};
export const onMessage = (socket, fn) => on(socket, 'message', fn);

export const consume = async (event) => {
    try {
        return JSON.parse(event.data);
    } catch (e) {
        if (typeof event.data === 'string') return event.data;
        throw e;
    }
};

/**
 * Tracks server pings for determining if the connection dropped.
 * Will terminate non-responsive connections.
 * This close event should initiate the process of recreating the connection in the ws module manager (eg ws/user.js and modules/ws-user.js)
 * @see https://gist.github.com/thiagof/aba7791ef9504c1184769ce401f478dc
 *
 * Modified to work with WebSocket interface.
 */
export function setupWsHeartbeat(ws: ReconnectingWebSocket) {
    let to;
    // will close the connection if there's no ping from the server
    function heartbeat() {
        clearTimeout(to);

        // Use `WebSocket#terminate()` and not `WebSocket#close()`. Delay should be
        // equal to the interval at which server sends out pings plus an assumption of the latency.
        to = setTimeout(() => {
            orgLogger.warning`Ping timeout. Terminating socket connection.`;
            ws.close();
        }, 30000 + 1000);
    }

    ws.addEventListener('open', heartbeat);
    ws.addEventListener('message', heartbeat);
    ws.addEventListener('message', (e) => {
        const msg = e.data;
        if (msg === 'ping') {
            orgLogger.debug`Sending heartbeat.`;
            ws.send('pong');
        }
    });
    ws.addEventListener('close', function clear() {
        clearTimeout(to);
    });
}
