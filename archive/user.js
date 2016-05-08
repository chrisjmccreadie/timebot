/*
*Main todos
*
* User update, delete
* payment send method
* reputaiton scores logged for each user
* add user type 
* associate users to a group for group reputations and further clarafication.
*
*/


//include all the things
var express = require('express');
var router = express.Router();
var r = require('rethinkdb');

//note (chris) when I figure out how to pass vars to callbacks this will not be required.
var key = '';
var amount = 0;

function processPayment(result,res)
{
      //note (chris) (todo) pass the amount.
      if (result.balance > amount)
      {
        //note (chris) (todo) make the payment
        //note (chris) (todo) mark the payment as pendoing and only allow one cash out at a time.  Also first time / low reputation cashouts have to be 
        //                    marked for manual release, this will be a config which can be overridden if desired.
        res.json({status:'Account balance being sent'});
        
      }
      else
      {
        res.json({status:'Account balance is not high enough not processed'});
      }
}

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
      if (err) throw err

      
      if (result == null) 
      {
        //console.log(err);
        //console.log(JSON.stringify(result, null, 2));
        res.json({'status':'Unknown error creating user' });


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




/*
*This functions settles a paymet to the bitcoin address we have on record
*/

router.get('/settle/:key/:amount', function(req,res){
   //get the details.
   key = req.params.key;
   amount = req.params.amount;
  //note we may require more than just the key here when we go into production, I know we only every show this once when they create the account 
  //     but full 2 auth flow is much better in this instance. 
  r.db('timebot').table('users').get(key).
    run(connection, function(err, result) 
    {
      if (err) throw err;
      //zero result returned
      if (result == null)
      {
        res.json({status:'Error user not found'});
      }
      else
      {
        //process the payment
        processPayment(result,res);
      }
  });


});


/*
*This function list the details for the account.
*/
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