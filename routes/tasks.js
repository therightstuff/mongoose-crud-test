var config = require('config');
var mongoose = require('mongoose');
var Task = require('../models/Task');

// it's probably a good idea to set options like connection pool size
mongoose.connect(config.get('tasks.dbConnectionString'));

handler = {
	// register routes
	register: function(server) {
		server.post('/api/users/:user_id/tasks', handler.create);
		server.get('/api/users/:user_id/tasks', handler.list);
		server.get('/api/users/:user_id/tasks/:task_id', handler.read);
		server.put('/api/users/:user_id/tasks/:task_id', handler.update);
		server.del('/api/users/:user_id/tasks/:task_id', handler.del);
	},

	// error handler
	error: function(res, err, msg) {
		console.error(err.message);
		// return custom message if available
		if (msg) {
			return res.send(500, msg);
		}
		return res.send(500, err.msg);
	},
	
	// create
	create: function(req, res) {
		Task.create({
			user: req.params.user_id,
			name: req.body.name,
			description: req.body.description,
			status: req.body.status,
			// manually set default datetime values to now (not enough time to figure out why the schema default value doesn't update)
			date_time: req.body.date_time || Date.now(),
			next_execute_date_time: req.body.next_execute_date_time || Date.now()
		},
		function (err, task){
			if (err) {
				return handler.error(res, err, 'failed to create task');
			}
			return res.json(task);
		});
	},
	
	// list
	list: function(req, res) {
		Task.find({ user : req.params.user_id })
			.exec(function (err, tasks) {
				if (err) {
					return handler.error(res, err, 'failed to list tasks');
				}
				return res.json(tasks);
			});
	},
	
	// read
	read: function(req, res) {
		Task.find({
			_id: req.params.task_id,
			user: req.params.user_id
		}, function (err, task) {
			if (err) {
				return handler.error(res, err, 'task not found');
			}
			return res.json(task);
		});
	},
	
	// update
	update: function(req, res) {
		Task.findOne({
			_id: req.params.task_id,
			user: req.params.user_id
		}, function (err, task) {
			if (err) {
				return handler.error(res, err, 'task not found');
			}
			// i'm assuming we cannot update the task user
			task.name = req.body.name || task.name;
			task.description = req.body.description || task.description;
			task.status = req.body.status || task.status;
			task.date_time = req.body.date_time || task.date_time;
			task.next_execute_date_time = req.body.next_execute_date_time || task.next_execute_date_time;

			task.save(function (err, task) {
				if (err) {
					return handler.error(res, err, 'failed to update task');
				}
				return res.json(task);
			});			
		});
	},
	
	// delete
	del: function(req, res) {
		Task.findOneAndRemove(
			{
				_id: req.params.task_id,
				user: req.params.user_id
			}, function (err, user) {
			if (err) {
				return handler.error(res, err, 'failed to delete task');
			}

			// return empty 200 OK message
			return res.send();
		});
	}
};

module.exports = handler;