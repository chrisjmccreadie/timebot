
//include all the things
var express = require('express');
var router = express.Router();
var r = require('rethinkdb');
//note (chris) there is no requirement for these to be global.
var submitterid = 0;
var submiterclaimid = 0;
var taskname = '';



//open a connection to the rethink database.
var connection = null;
r.connect( {host: 'localhost', port: 28015,database:'timebot'}, function(err, conn) {
    if (err) throw err;
    connection = conn;
})


//note (chris ) this seemds odd that I require a public function, like this research the call back or the chainging of rethinkdb
function setSubmitId(result)
{
	//this is the balance amount to add to the users account, this is set to one initially 
	//note (chris) when we get to the machine learning fun then we we will set this based on the quality of the task added
	//			   and modifiers for the reputation of the user.
	var balanceamoount = 1;

	//check the count.
	if (result == 0)
	{
		submiterclaimid = submitterid;
		submitterid = 0;

	}
	else
	{
		submiterclaimid =0;
	}


	//add a record based on the names
  	//note (chris) make this check the min paramaters are in place. 
  	r.db('timebot').table('tasks').insert([
    	   { name: taskname,submitterid: submitterid,submiterclaimid:submiterclaimid}
    	  
	]).run(connection, function(err, result) 
	{
		//oh on something done gone wrong.
   		if (err != null)
    		console.log(JSON.stringify(result, null, 2));

    	//note (Chris) if the user is not anon then update there balance if it is anon update charity balance. 
	})

	//we have to update the user balance, they gave us data they deserve.

	if (submitterid != 0)
	{
		//this is so cool, easy to add one and if the field is not there sets it to 1.  Go nosql!!!!
		r.db('timebot').table("users").get(submitterid).update({
    		balance: r.row("balance").add(balanceamoount).default(1)
		}).run(connection)
	}
	else
	{
		//they either specifed it as anon or we could not find the key either it is added to the charity balance
		//note (chris) we may want to log the time for each of these charity additions as at some point in the future a user could come 
		//			   in and claim a block taking the charity balance into the minus, which is no good at all. 		
		
		r.db('timebot').table("charity").get('f7cfcee1-b3f3-4922-b05d-54897f3b48f7').update({balance: r.row("balance").add(balanceamoount).default(1)}).run(connection);
		

	}
}

/*
* This function processes the add task 
*/
function processAddTask(req,res)
{
	//get the vars from the route

	//submitter id : set to 0 for annon
	// check to see if this person exists in the database and if they do add it otherwise add it as annon 
	submitterid = req.params.submitterid;
	//set the sumbmitter claim id to 0;
	//taskname var
	taskname = req.params.taskname;
	//find the user, count to see of he exists.
	//note (chris) we can chain the following right > update his balance if he is here
	r.db('timebot').table('users').filter(r.row('id').eq(submitterid)).count().
    run(connection, function(err, result) 
    {
	    if (err) throw err;
		
		//note (Chris) I am calling an external function because I could not get access to the req function in this var, it seems very odd
		//			   this would be the case I am surely doing something wrong here. I will refactor this later when I have more knowledge
		//			   of how Node.js does this kind of thing.
		setSubmitId(result);

	});

	//if user not found set the sumbitterid to 0 and set the claimid to the id submitted.
	//output it to the screen.
  	res.send('Task Name:'+taskname);
}


// define the  add task route
// note (chris) we could link these routes together instead of having the get and post toghether, research how.
router.get('/add/:submitterid/:taskname', function(req, res) {
	processAddTask(req,res);
});

// define the  add task route
router.post('/add/:submitterid/:taskname', function(req, res) {
	processAddTask(req,res);
});
// define the about route
router.get('/about', function(req, res) {
  //build theoutput for res
  var output = "Add tasks";
  output = output+"<br>method : addtask";
  output = output+"<br>parmaters:";
  output = output+"<br>taskname = the name of the task";
  output = output+"<br>Swagger docs coming soon";
  //output it.
  res.send(output);

});


module.exports = router;