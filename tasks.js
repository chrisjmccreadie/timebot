
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

/*
* This function processes the add task 
*/
function processAddTask(req,res)
{
	//get the vars from the route

	//submitter id : set to 0 for annon
	//note (Chris) check to see if this person exists in the database and if they do add it otherwise add it as annon 
	//note (Chris) people can come in later and claim the task if they send the new key and the one the orginially sent into this.
	var submitterid = req.params.submitterid
	//taskname var
	var taskname = req.params.taskname;
  	//add a record based on the names
  	//note (chris) make this check the min paramaters are in place. 
  	r.db('timebot').table('tasks').insert([
    	   { name: taskname,submitterid: submitterid}
    	  
	]).run(connection, function(err, result) 
	{
		//oh on something done gone wrong.
   		if (err != null)
    		console.log(JSON.stringify(result, null, 2));

    	//note (Chris) if the user is not anon then update there balance if it is anon update charity balance. 
	})
	//output it to the screen.
  	res.send('Task Name:'+taskname);
}


// define the  add task route
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