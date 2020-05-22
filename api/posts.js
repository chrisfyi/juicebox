const express = require('express');
const postsRouter = express.Router();

const { getAllPosts } = require('../db')

postsRouter.get('/', async (req, res, next) => {

    const posts = await getAllPosts();

    res.send({
        posts
    });

    next()
})

// usersRouter.get('/', async  (req, res , next) => {
//     const users = await getAllUsers();

//     res.send({
//       users
//     });

//     next()
//   });

module.exports = postsRouter;