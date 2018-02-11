var config = require('config');
var mongoose = require('mongoose');
var User = require('../models/User');

// it's probably a good idea to set options like connection pool size
mongoose.connect(config.get('tasks.dbConnectionString'));

handler = {
	// register routes
	register: function(server) {
		server.post('/api/users', handler.create);
		server.get('/api/users', handler.list);
		server.get('/api/users/:user_id', handler.read);
		server.put('/api/users/:user_id', handler.update);
		server.del('/api/users/:user_id', handler.del);
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
		User.create({
			username: req.body.username,
			first_name: req.body.first_name,
			last_name: req.body.last_name
		},
		function (err, user){
			if (err) {
				return handler.error(res, err, 'failed to create user');
			}
			return res.json(user);
		});
	},
	
	// list
	list: function(req, res) {
		User.find(function(err, users){
			if (err) {
				return handler.error(res, err, 'failed to list users');
			}
			return res.json(users);
		});
	},
	
	// read
	read: function(req, res) {
		User.findById(req.params.user_id, function (err, user) {
			if (err) {
				return handler.error(res, err, 'user not found');
			}
			return res.json(user);
		});
	},
	
	// update
	update: function(req, res) {
		User.findById(req.params.user_id, function (err, user) {
			if (err) {
				return handler.error(res, err, 'user not found');
			}
			user.username = req.body.username || user.username;
			user.first_name = req.body.first_name || user.first_name;
			user.last_name = req.body.last_name || user.last_name;

			user.save(function (err, user) {
				if (err) {
					return handler.error(res, err, 'failed to update user');
				}
				return res.json(user);
			});			
		});
	},
	
	// delete
	del: function(req, res) {
		User.findByIdAndRemove(req.params.user_id, function (err, user) {
			if (err) {
				return handler.error(res, err, 'failed to delete user');
			}

			// return empty 200 OK message
			return res.send();
		});
	}
};

module.exports = handler;