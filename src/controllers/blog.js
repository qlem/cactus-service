'use strict';

const express = require('express');
const Post = require('./../models/post');
const router = express.Router();
const Auth = require('./../middleware/authentication');

router.get('/', async  (req, res) => {
    try {
        let posts = await Post.getAll();
        res.send(posts)
    } catch (e) {
        res.status(500).send('Internal error');
        console.error("Cannot get posts");
        if (e.stack)
            console.error(e.stack)
    }
});

router.post('/', Auth.auth, async (req, res) => {
    try {
        if (!req.body.data || !req.body.data.title || !req.body.data.body) {
            res.status(400).send('Wrong or empty body');
            return
        }
        let post = req.body.data;
        post.authorId = req.user._id;
        let doc = await Post.add(post);
        res.send(doc)
    } catch (e) {
        res.status(500).send('Internal error');
        console.error("Cannot create a new post");
        if (e.stack)
            console.error(e.stack)
    }
});

router.put('/', Auth.auth, async (req, res) => {
    try {
        if (!req.body.data || !req.body.data._id || !req.body.data.title ||
            !req.body.data.body) {
            res.status(400).send('Wrong or empty body');
            return
        }
        // TODO do not allow to edit a post from another author
        let post = req.body.data;
        post.lastEdited = {
            authorId: req.user._id,
            date: Date.now()
        };
        let obj = await Post.update(post);
        if (obj.n !== 1) {
            res.status(400).send('Wrong post id');
            return
        }
        res.send(post)
    } catch (e) {
        res.status(500).send('Internal error');
        console.error("Cannot update post");
        if (e.stack)
            console.error(e.stack)
    }
});

router.delete('/', Auth.auth, async (req, res) => {
   try {
       if (!req.query.postId) {
           res.status(400).send('Missing post id in query params');
           return
       }
       let wr = await Post.delete(req.query.postId);
       if (wr.n !== 1) {
           res.status(400).send('Wrong post id');
           return
       }
       res.send({})
   } catch (e) {
       res.status(500).send('Internal error');
       console.error("Cannot delete post");
       if (e.stack)
           console.error(e.stack)
   }
});

module.exports = router;
