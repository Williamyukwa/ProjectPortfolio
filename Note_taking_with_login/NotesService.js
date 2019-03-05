const fs = require('fs');

class NoteService {
    constructor(filename){
        this.filename = filename;
        this.notes = [];
    }

    //Listing -> reading
    ListNode (){
        return new Promise((resolve, reject)=>{
            fs.readFile(this.filename, (err, data) => {
                if (err) throw err;
                this.notes = JSON.parse(data)
            });
            resolve();
        })
    }

    //Adding -> reading -> writing
    AddNode(note){
        return new Promise((resolve, reject)=>{
            this.ListNode().then(() =>{
                var obj = {
                    'title' : note.title,
                    'context' : note.context
                }
                this.notes.push(obj);
        
                fs.writeFile(this.filename, JSON.stringify(this.notes), (err) => {
                    if (err) throw err;
                    return;
                });
            })
            resolve();
        })
    }

    //Editing -> id(remove old data) -> writing
    EditNode(id,note){
        return new Promise((resolve, reject)=>{
            var obj = {
                'title' : note.title,
                'context' : note.context
            }
            this.notes.splice(id,1,obj)
            //deleting old version data
            fs.truncate(this.filename, 0, function(){console.log('done')})
            fs.writeFile(this.filename, JSON.stringify(this.notes), (err) => {
                if (err) throw err;
                return;
            });
            resolve();
        })
    }

    //delete -> id(remove all)
    DelNode(id){
        return new Promise((resolve, reject)=>{
            this.notes.splice(id,1);
            fs.truncate(this.filename, 0, function(){console.log('done')})
            fs.writeFile(this.filename, JSON.stringify(this.notes), (err) => {
                if (err) throw err;
                return;
            });
            resolve();
        })
    }

}

module.exports = NoteService;