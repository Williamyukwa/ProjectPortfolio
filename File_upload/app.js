const express = require('express');
const path = require('path');
const fs  = require('fs');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const store = "./store"

var cache = {};
const app = express();
app.use(express.static('public'));
app.use(fileUpload());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'HomePage.html'));
})

app.get('/upload', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'Upload.html'));
})  

app.get('/download', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'Download.html'));
})

app.post('/upload', function(req, res){
    writefile(req.files.profile.name, req.files.profile.data)
    .then((name) => cache[req.files.profile.name] = name)
    .then(() => res.redirect('/'))
    .then(() => console.log(cache))
    .catch((e) => res.status(500).send(e.message))
})

app.get('/upload/:id', function(req, res){
    readfile(req.params.id)
    .then((data) => res.send(data))
    .then(() => res.redirect('/'))
})

var writefile = (name, data) =>{
    return (new Promise((resolve, reject) =>{
        fs.writeFile(store + path.sep + name, data, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        resolve(name)
    }))
}

var readfile = (name) =>{
    return (new Promise((resolve, reject) =>{
        fs.readFile(store + path.sep + name, (err, data) => {
            if (err) throw err;
            resolve(data);
            console.log(data)
        });
    }))
}

app.listen(3000)