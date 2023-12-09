var mongoose = require('mongoose');

var ReminderSchema = new mongoose.Schema({
    plant_name: String,
    date: Date,
    frequency: Number
});

module.exports = mongoose.model('Reminder', ReminderSchema)