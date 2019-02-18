const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const save = require('./cache');
const multer = require('multer');

const app = express();
const upload = multer();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload());
var cache  = {};

//define the routing url to particular html files
app.get('/',(req,res)=>{
	res.sendFile(path.join(__dirname,'app.html'));
});

app.get('/upload',(req,res)=>{
	res.sendFile(path.join(__dirname,'upload.html'));
});

app.post('/upload',(req,res)=>{
	save.writefile(req.files.profile.name, req.files.profile.data)
	.then(() => res.send(`we get ${req.files.profile}`))
	.catch((e) => res.status(500).send(e.message))
});

app.get('/upload/:id', (req, res) => {
	save.readfile(req.params.id)
	.then((e) => res.send(e))
	.catch((e)=> res.status(500).send(e.message));
})

app.get('/download',(req,res)=>{
	res.sendFile(path.join(__dirname,'download.html'));
});

app.listen(8080);