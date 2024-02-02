const lessonService = require('../../services/lessonService');
const questionService = require('../../services/questionService');

const addQuestionHandler = (socket) => {
    socket.on('askQuestion', async (data) => {
        const publicKey = socket.roomId || false;
        const question = data.question || false;

        if (!publicKey) { socket.emit('Error', 'You are not connected to any room.'); return; };
        if (!question) { socket.emit('Error', 'Bad input.'); return; };

        try {
            const lessonData = await lessonService.getLessonByPublicKey({publicKey});
            const lessonId = lessonData[0].id;
            const privateKey = lessonData[0].private_key;
        
            const _ = await questionService.createQuestion({question, lessonId});
            socket.to(privateKey).emit('newQuestion', `${question}`);
            socket.emit('questionAdded', "Question was added.");
        }
        catch (err) {
            socket.emit('Error', 'error occurred when adding question');
            console.log(err.message);
            // TODO LOGGING
        }
    })
}

module.exports = { addQuestionHandler };