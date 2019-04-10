'use strict';

const express = require('express');
const Post = require('./../models/post');
const router = express.Router();
const Auth = require('./../middleware/authentication');

/**
 * GET request - full path: /blog/
 * Route that allows to the client to fetch all posts or only the posts for the desired category.
 */
router.get('/', async  (req, res) => {
    try {
        let posts;
        if (req.query.type) {
            posts = await Post.getAll({
                type: req.query.type,
                published: true
            })
        } else {
            posts = await Post.getAll({});
        }
        res.send(posts)
    } catch (e) {
        res.status(500).send('Internal error');
        console.error("Cannot get posts");
        if (e.stack)
            console.error(e.stack)
    }
});

/**
 * POST request - full path: /blog/
 * Route that allows to add a new post. The authentication middleware is call before proceed
 * to insert in database. Only the authenticated users are able to add a post.
 */
router.post('/', Auth.auth, async (req, res) => {
    try {
        if (!req.body.data || !req.body.data.title || !req.body.data.body) {
            res.status(400).send('Wrong or empty body');
            return
        }
        let post = req.body.data;
        post.authorId = req.user._id;
        const doc = await Post.add(post);
        res.send(doc)
    } catch (e) {
        res.status(500).send('Internal error');
        console.error("Cannot create a new post");
        if (e.stack)
            console.error(e.stack)
    }
});

/**
 * PUT request - full path: /blog/
 * Route that allows to update a post. The authentication middleware is call before proceed
 * to update in database. Only the authenticated users are able to update a post.
 */
router.put('/', Auth.auth, async (req, res) => {
    try {
        if (!req.body.data || !req.body.data._id) {
            res.status(400).send('Wrong or empty body');
            return
        }
        let post = req.body.data;
        if (post.title || post.body) {
            post.lastEdited = {
                authorId: req.user._id,
                date: Date.now()
            };
        }
        const wr = await Post.update(post);
        if (wr.n !== 1) {
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

/**
 * DELETE request - full path: /blog/
 * Route that allows to delete a post. The authentication middleware is call before proceed
 * to delete in the database. Only the authenticated users are able to delete a post.
 */
router.delete('/', Auth.auth, async (req, res) => {
   try {
       if (!req.query.postId) {
           res.status(400).send('Missing post id in query params');
           return
       }
       const wr = await Post.delete(req.query.postId);
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
