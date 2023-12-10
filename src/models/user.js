// Load required packages
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    picture_path: String,
    plants: [Number],
    reminders: [String]
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);

