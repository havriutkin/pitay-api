const { Server } = require('socket.io');
const session = require('./session.config');
const { mountHandlers } = require('../sockets/index');
const helmet = require('helmet');

const initializeSocketIo = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ["GET", "POST"]
        }
    });

    // Set up middlewares
    io.engine.use(helmet());
    io.engine.use(session.middleware);

    // Apply handlers on io
    mountHandlers(io);
}

module.exports = { initializeSocketIo }