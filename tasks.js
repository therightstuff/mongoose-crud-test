var config = require('config');
var restify = require('restify');

var server = restify.createServer({
    name: 'tasks',
});

server.use(restify.plugins.bodyParser());

// configure routes
require('./routes/users').register(server);
require('./routes/tasks').register(server);

server.on('NotFound', function (req, res) {
	res.send(404, req.url + ' not found');
});

process.on('uncaughtException', function (err) {
	console.error('uncaughtException: ' + err.message);
	console.error(err.stack);
});

server.listen(config.get('tasks.port'));
console.info('tasks server started ' + new Date());
