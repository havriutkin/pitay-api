const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');


const errorHandler = require('./src/middlewares/errorHandlerMiddleware');
const session = require('./src/config/session.config');
const { passport } = require('./src/config/passport.config');
const { initializeSocketIo } = require('./src/config/socket.config');

const authRouter = require('./src/routes/authRouter');
const lessonRouter = require('./src/routes/lessonRouter');
const questionRouter = require('./src/routes/questionRouter');

const port = process.env.PORT || 4000;
const app = express();
const server = createServer(app);


// --------------- SECURITY ---------------
// Disable powered-by header
app.disable('x-powered-by')

app.use(helmet());


// --------------- MIDDLEWARES ---------------
// Static files 
app.use(express.static(__dirname + '/public'));

// Session
app.use(session.middleware);

// Passport session
app.use(passport.initialize());
app.use(passport.session());

// Body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Init sockets
initializeSocketIo(server);


// --------------- ROUTES ---------------
app.use('/api/auth', authRouter);
app.use('/api/lesson', lessonRouter);
app.use('/api/question', questionRouter);

// Error handler
app.use(errorHandler);


server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = app;