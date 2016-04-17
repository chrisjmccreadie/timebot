
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

router.get('/details/:key', function(req, res) {
  var key = req.params.key
  //build theoutput for res
  //note we may require more than just the key here when we go into production, I know we only every show this once when they create the account 
  //     but full 2 auth flow is much better in this instance. 
  r.db('timebot').table('users').get(key).
    run(connection, function(err, result) 
    {
      if (err) throw err;

      //zero result returned
      if (result == null)
        res.json({status:'Error user not found'});
      else
        res.json({balance:result.balance,taskssubmitted:result.taskssubmitted});
  });

  
});


// define the about route
router.get('/about', function(req, res) {
  //build theoutput for res
  var output = "User tasks";
  output = output+"<br>method : create (creates a user)";
  output = output+"<br>parmaters:";
  output = output+"<br>key = the key to auth with";
  output = output+"<br>username = username";
  output = output+"<br>password = password";
  output = output+"<br><br>method : details (shows the balance of a user)";
  output = output+"<br>key = the key to auth with";



  //output it.
  res.send(output);

});


module.exports = router;