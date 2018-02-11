var axios = require('axios');
var config = require('config');

var api_url =
	'http://' + config.get('tasks.host') +
	':' + config.get('tasks.port') +
	'/api';

var search_users_for_tasks = function() {
	axios.get(api_url + '/users')
		.then(response => {
			// loop over users
			for (var i in response.data) {
				check_user_tasks(response.data[i]._id)
			}
		})
		.catch(error => {
			console.error(error);
		});
};

var check_user_tasks = function(user_id) {
	axios.get(api_url + '/users/' + user_id + '/tasks')
		.then(response => {
			// loop over user's tasks
			for (var i in response.data) {
				check_task(response.data[i]);
			}
		})
		.catch(error => {
			console.error(error);
		});
};

var check_task = function(task) {
	if (task.status == 'pending') {
		var execution_time_passed = new Date(task.next_execute_date_time) < new Date(Date.now());
		if (execution_time_passed) {
			// print to the console
			console.info('updating ' + task.name + ' status to done');
			// update task to done
			axios.put(api_url + '/users/' + task.user + '/tasks/' + task._id, {
					status: 'done'
				})
				.catch(function (error) {
					console.error(error);
				});
		}
	}
};

search_users_for_tasks();