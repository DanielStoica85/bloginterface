const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Home Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server started on port ' + process.env.PORT + '.');
});