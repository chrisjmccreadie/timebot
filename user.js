
//include all the things
var express = require('express');
var router = express.Router();
var r = require('rethinkdb');

//open a connection to the rethink database.
var connection = null;
r.connect( {host: 'localhost', port: 28015,database:'timebot'}, function(err, conn) {
    if (err) throw err;
    connection = conn;
})




// create a account the key is what you use to add tasks, username and password is for utility functions later
// note (chris) 2 auth this by default.
router.post('/create/:key/:username/:password', function(req, res) {
  //submitter id : set to 0 for annon
  var key = req.params.key
  //taskname var
  var username = req.params.username;
  //taskname var
  var password = req.params.password;
  //add a record based on the names
  //note (chris) make this check the min paramaters are in place. 
  r.db('timebot').table('users').insert([
         { key: key,username: username,'password':password}
        
  ]).run(connection, function(err, result) 
  {
      //error
      if (err != null) 
      {
        console.log(err);
        console.log(JSON.stringify(result, null, 2));

      }
      else
      {
        //return the key they will use for authing
        res.json({'key':result.generated_keys });
         //console.log(result.generated_keys);
      }



       //res.send(JSON.stringify(result, null, 2));
  })
  
});


// define the about route
router.get('/about', function(req, res) {
  //build theoutput for res
  var output = "User tasks";
  output = output+"<br>method : create";
  output = output+"<br>parmaters:";
  output = output+"<br>key = the key to auth witj";
  output = output+"<br>username = username";
  output = output+"<br>password = password";

  //output it.
  res.send(output);

});


module.exports = router;