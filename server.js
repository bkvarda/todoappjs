// set up =============================
var express = require('express');
var app = express();
var mongoose = require('mongoose');

// configuration ======================

mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/owosom5U');

app.configure(function(){
	app.use(express.static(__dirname + '/public')); //set the static files location, IE /public/folder will just be /folder for users
	app.use(express.logger('dev')); //log every request to the console
	app.use(express.bodyParser()); //pull info from HTML in POST
	});
	
// define model ==============
var Todo = mongoose.model('Todo',{
		text : String
});

// routes ==============================

	//api ----------------------------------
	// get all todos
	app.get('/api/todos', function(req, res){
	
		//use mongoose to get all todos in the db
		Todo.find(function(err, todos){
		
			//if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)
				
			res.json(todos); // return all todos in JSON format
		});
	});
	
	//create todo and send back all todos after creation
	app.post('/api/todos', function(req, res){
	
		//create a todo, information comes from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo){
			if (err)
				res.send(err);
				
			//get and return all the todos after you create another
			Todo.find(function(err, todos){
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});
	
	//delete a todo
	app.delete('/api/todos/:todo_id', function(req, res){
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo){
			if (err)
				res.send(err);
				
			//get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});
	
	
//application
app.get('*',function(req, res){
	res.sendfile('./public/index.html'); // load the single view file
});
	
// listen at port blah
	
app.listen(8080);
console.log("App listening on port 8080");
	
	