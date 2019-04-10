'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Schema that represents the post model
 */
const postSchema = new Schema({
    title: String,
    authorId: ObjectId,
    date: {
        type: Date,
        default: Date.now
    },
    body:   String,
    lastEdited: {
        authorId: ObjectId,
        date: Date
    },
    type: String,
    published: Boolean
});

const Post = mongoose.model('Post', postSchema);

// query used for get a post according the the filter
exports.get = filter => Post.findOne(filter);

// query used for get all post according to the the 'match' object
// if 'match' object is empty, returns all posts
exports.getAll = match => Post.aggregate([
    {
        $match: match
    },
    {
        $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author'
        }
    },
    {
        $lookup: {
            from: 'users',
            localField: 'lastEdited.authorId',
            foreignField: '_id',
            as: 'editedBy'
        }
    },
    {
        $project: {
            title: 1,
            author: {
                $arrayElemAt: ['$author.userName', 0]
            },
            date: 1,
            body: 1,
            type: 1,
            published: 1,
            lastEdited: {
                author: {
                    $arrayElemAt: ['$editedBy.userName', 0]
                },
                date: '$lastEdited.date'
            }
        }
    },
    {
        $sort: {
            date: -1
        }
    }
]);

// query used for insert a post
exports.add = post => Post.create(post);

// query used for update a post
exports.update = post => Post.updateOne({_id: post._id}, post);

// query used for delete a post
exports.delete = postId => Post.deleteOne({_id: postId});

