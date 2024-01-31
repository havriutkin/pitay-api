const express = require('express');
const bodyParser = require('body-parser');

const authRouter = require('./src/routes/authRouter');

const app = express();
const port = process.env.PORT || 4000;

// Disable powered-by header
app.disable('x-powered-by')

// Static files 
app.use(express.static(__dirname + '/public'));

// Body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// ROUTES
app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = app;