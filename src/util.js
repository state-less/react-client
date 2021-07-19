import { v4 } from 'uuid';
import baseLogger from './logger';

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
}

export const emit = (socket, data) => {
    if (Array.isArray(socket)) {
        socket.forEach((socket) => {
            socket.send(JSON.stringify(data));
        })
    } else {
        socket.send(JSON.stringify(data));
    }
}

export const request = async (socket, data) => {
    const id = v4();
    emit(socket, {type: request, id, ...data});
    return new Promise((resolve, reject) => {

        const onResponse = async (event) => {
            const data = await consume(event);
            const json = parseSocketResponse(data);
            
            if (data.id === id) {
                off(socket, 'message', onResponse)
                resolve(json);
            }
        }
        on(socket, 'message', onResponse);
    })
}

export const on = (socket, event, fn) => {
    socket.addEventListener(event, fn)
}

export const off = (socket, event, fn) => {
    socket.removeEventListener(event, fn);
}
export const onMessage = (socket, fn) => on(socket, 'message', fn);

export const consume = async (event) => {
    try {
        return JSON.parse(event.data);
    } catch (e) {
        if (typeof event.data === 'string') 
            return event.data;
        throw e;
    }
}