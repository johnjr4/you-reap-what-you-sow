var mongoose = require('mongoose');
const { Schema } = mongoose;

var PlantSchema = new mongoose.Schema({
    "id": Number,
    "common_name": String,
    "scientific_name": [String],
    "other_name": [String],
    "family": String,
    "origin": [String],
    "type": String,
    "dimensions": Schema.Types.Mixed,
    "cycle": String,
    "watering": String,
    "depth_water_requirement": Schema.Types.Mixed,
    "volume_water_requirement": Schema.Types.Mixed,
    "watering_period": String,
    "watering_general_benchmark": Schema.Types.Mixed,
    "plant_anatomy": [Schema.Types.Mixed],
    "sunlight": [String],
    "pruning_month": [String],
    "pruning_count": Schema.Types.Mixed,
    "seeds": Number,
    "attracts":[String],
    "propagation":[String],
    "hardiness": Schema.Types.Mixed,
    "hardiness_location": Schema.Types.Mixed,
    "flowers": Boolean,
    "flowering_season": String,
    "color": String,
    "soil": [Schema.Types.Mixed],
    "pest_susceptibility": Schema.Types.Mixed,
    "cones": Boolean,
    "fruits": Boolean,
    "edible_fruit": Boolean,
    "fruit_color": Schema.Types.Mixed,
    "fruiting_season": Schema.Types.Mixed,
    "harvest_season": Schema.Types.Mixed ,
    "harvest_method": String,
    "leaf": Boolean,
    "leaf_color": [String],
    "edible_leaf": Boolean,
    "growth_rate": String,
    "maintenance": String,
    "medicinal": Boolean,
    "poisonous_to_humans": Boolean,
    "poisonous_to_pets": Boolean,
    "drought_tolerant": Boolean,
    "salt_tolerant": Boolean,
    "thorny": Boolean,
    "invasive": Boolean,
    "rare": Boolean,
    "rare_level": String,
    "tropical": Boolean,
    "cuisine": Boolean,
    "indoor": Boolean,
    "care_level": String,
    "description": String,
    "default_image": Schema.Types.Mixed
})

module.exports = mongoose.model('Plant', PlantSchema)