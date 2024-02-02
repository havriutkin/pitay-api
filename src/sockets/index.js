const { addQuestionHandler } = require("./handlers/addQuestionHandler");
const { joinRoomHandler } = require("./handlers/joinRoomHandler");

const mountHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected');

        // Set up event handlers
        joinRoomHandler(socket);
        addQuestionHandler(socket);
    });

    io.on('disconnect', () => {
        console.log('User disconnected');
    })
}

module.exports = {mountHandlers}