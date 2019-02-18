const fs = require('fs');
const path = require('path');
const storeplace = './public/uploadedstore';


var writefile = function (name, data){
    return (new Promise ((resolve, reject) => {
        fs.writeFile(storeplace + path.sep + name, data, (err) =>{
            if (err) throw err;
            console.log('The file has been saved!');
        })
        resolve(name);
    }))
}

var readfile = function (file){  
    return (new Promise ((resolve, reject) => {
    fs.readFile(storeplace + path.sep + file, (err, data) => {
        if (err) throw err;
        resolve(data)
      });
    }))
}


module.exports = {
    writefile,
    readfile
}