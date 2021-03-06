const express = require('express');
const tagsRouter = express.Router();

const { getAllTags } = require('../db')

tagsRouter.get('/', async (req, res, next) => {

    const tags = await getAllTags();

    res.send({
        tags
    });

    next()
})

module.exports = tagsRouter;