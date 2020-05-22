const express = require('express');
const usersRouter = express.Router();

const { getAllUsers } = require('../db');


usersRouter.get('/', async  (req, res, next) => {
    const users = await getAllUsers();

    res.send({
      users
    });

    next()
  });

  // usersRouter.use((req, res, next) => {
//   console.log("A request is being made to /users");

//   res.send({ message: 'hello from /users!' });

//   next();
// });

module.exports = usersRouter;