var express = require('express');
var app = express();


app.get('/', function (req, res) {
  res.send('Hello World I am time bot');
});

//call in the tasks module
var tasks = require('./tasks');
app.use('/tasks', tasks);

//listen for connections
app.listen(3000, function () {
  console.log('Hello I am timebot!');
});
