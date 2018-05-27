const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home)

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger("Morgan Enabled...");
}

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server Name: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

app.use(logger);

dbDebugger("Connection to DB...")

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
