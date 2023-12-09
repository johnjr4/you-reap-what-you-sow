var mongoose = require('mongoose');

var PlantSchema = new mongoose.Schema({
    id: Number,
    common_name: String,
    scientific_name: String,
    cycle: String,
    watering: String,
    default_image: String
})

module.exports = mongoose.model('Plant', PlantSchema)

