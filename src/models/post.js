'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

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

exports.get = filter => Post.findOne(filter);
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
exports.add = post => Post.create(post);
exports.update = post => Post.updateOne({_id: post._id}, post);
exports.delete = postId => Post.deleteOne({_id: postId});
