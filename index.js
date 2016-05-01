//load the express framework.
var express = require('express');
//load the config file.
var nconf = require('nconf');
//load express
var app = express();
//note (Chris) when this is includes in the routs it picks up the port etc, this appears to be 
//persistent, look into the nconf class and see how this is happening.
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

//standard app function.
app.get('/', function (req, res) {
  res.send('I knows tasks and users, please use them');
});

//call in the bitcoin module
var bitcoin = require('./bitcoin');
app.use('/bitcoin', bitcoin);

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
