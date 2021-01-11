export const emit = (socket, data) => {
    socket.send(JSON.stringify(data));
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