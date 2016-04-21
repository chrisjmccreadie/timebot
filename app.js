var express = require('express');
//load the config file.
var nconf = require('nconf');
//load the bitcoin class
var bitcoin = require('bitcoinjs-lib');
var app = express();
// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();
// Then load configuration from a designated file.
nconf.file({ file: './config/'+app.get('env')+'.json' });
// Provide default values for settings not provided above.
nconf.defaults({
    'http': {
        'port': 3000
    }
});


//bitcoing usage 
//var keyPair = bitcoin.ECPair.makeRandom();
//console.log(keyPair.toWIF());

app.get('/', function (req, res) {
  res.send('I knows tasls and users, please use them');
});


//call in the tasks module
var tasks = require('./tasks');
app.use('/tasks', tasks);

//call in the user module
var user = require('./user');
app.use('/user', user);

//listen for connections
app.listen(nconf.get('http:port'), function () {
  console.log('Hello I am timebot!');
});
