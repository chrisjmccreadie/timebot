
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


// define the  add task route
router.get('/add/:taskname', function(req, res) {

	//get the vars from the route
	//taskname var
	var taskname = req.params.taskname;
  	//add a record based on the names
  	//note (chris) make this check the min paramaters are in place. 
  	r.db('timebot').table('tasks').insert([
    	   { name: taskname}
	]).run(connection, function(err, result) 
	{
		//oh on something done gone wrong.
   		if (err) throw err;
    		console.log(JSON.stringify(result, null, 2));
	})
	//output it to the screen.
  	res.send('Task Name:'+taskname);



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