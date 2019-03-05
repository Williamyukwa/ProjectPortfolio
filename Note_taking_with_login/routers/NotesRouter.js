const express = require('express')

class NotesRouter {
    constructor(NotesService){
        this.NotesService = NotesService
    }

    router(){
        let router = express.Router();
        router.get('/comment', this.get.bind(this))
        router.post('/comment', this.post.bind(this))
        router.put('/comment/:id', this.put.bind(this))
        router.delete('/comment/:id', this.delete.bind(this))
        return router;
    }

    get(req, res){
        return this.NotesService.ListNode()
            .then((data)=> res.json(data))
            .catch((err) => res.status(500).json(err))
    }

    post(req, res){
        return this.NotesService.AddNode(req.body)
            .then(() => res.redirect('/comment'))
            .catch((err) => res.status(500).json(err))
    }

    put(req, res){
        return this.NotesService.EditNode(req.params.id, req.body)
            .then(()=>res.status(204).send())
            .catch((err)=> res.status(500).json(err));
    }

    delete(req, res){
        return this.NotesService.EditNode(req.params.id)
            .then(()=>res.status(204).send())
            .catch((err)=> res.status(500).json(err));
    }
}

module.exports = NotesRouter;