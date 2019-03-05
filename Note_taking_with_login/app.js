const express = require('express');
const app = express();
const session = require('express-session');
const setupPassport = require('./passport');
const bodyParser = require('body-parser');
const router = require('./routers/router')(express);
const port = process.env.PORT || 8080;
const hb = require('express-handlebars'); 
const fs = require('fs');
const https = require('https');

app.use(express.static('public'))
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

const options = {
  cert: fs.readFileSync('./localhost.crt'),
  key: fs.readFileSync('./localhost.key')
};

//setting up handlebars in app.js is fine
app.engine('handlebars', hb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'supersecret'
}));

//linking passport with express
setupPassport(app);


const NoteService = require('./NotesService');
const NotesRouter = require('./routers/NotesRouter');
let notesService = new NoteService('notes.json')

app.use('/api/notes', new NotesRouter(notesService).router());
app.use('/', router);


var server = https.createServer(options, app).listen(port);

require('./socket')(server)
console.log('We are accessing the port:', port)