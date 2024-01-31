const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const authRouter = require('./src/routes/authRouter');
const errorHandler = require('./src/middlewares/errorHandlerMiddleware');

const app = express();
const port = process.env.PORT || 4000;


// --------------- SECURITY ---------------
// Disable powered-by header
app.disable('x-powered-by')

app.use(helmet());


// --------------- MIDDLEWARES ---------------
// Static files 
app.use(express.static(__dirname + '/public'));

// Body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// --------------- ROUTES ---------------
app.use('/api/auth', authRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = app;