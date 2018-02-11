var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, unique: true },
	description: String,
	status: { type: String, required: true, enum : [ 'pending', 'done'], default: 'pending' },
	date_time: { type: Date, default: Date.now() }, // from examples, assumed this means the time a task was last executed
	next_execute_date_time: { type: Date, default: Date.now() } // from requirements definition
});

module.exports = mongoose.model('Task', TaskSchema );