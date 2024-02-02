const lessonService = require('../../services/lessonService');

const joinRoomHandler = (socket) => {
    socket.on('joinRoom', async (data) => {
        const user = socket.request.session.passport?.user || false;
        const publicKey = data?.publicKey || false;

        const joinAsStudent = () => {
            socket.join(publicKey);
            socket.roomId = publicKey;
            socket.emit("joined", "Joined as student.");
        }

        const joinAsTeacher = (privateKey) => {
            socket.join(privateKey);
            socket.roomId = publicKey;
            socket.emit("joined", "Joined as teacher.");
        }

        if (!user) { joinAsStudent(); return; }
        if (!publicKey) { socket.emit('Error', 'Bad input.'); return; };

        try {
            const lessonData = await lessonService.getLessonByPublicKey({publicKey});
            if (lessonData.length === 0) { socket.emit('Error', 'Room does not exist.'); return; };

            if (user.id === lessonData[0].owner_id) {
                joinAsTeacher(lessonData[0].private_key);
            } else {
                joinAsStudent();
            }
        } catch(err) {
            socket.emit('Error', 'Error occurred when joining room.');
        }
    })
};

module.exports = { joinRoomHandler };