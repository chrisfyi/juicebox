const PORT = 3000;
const express = require('express');
const server = express();

const { client } = require('./db');
client.connect();



const apiRouter = require('../project_13/api');
server.use('/api', apiRouter);

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});



server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

