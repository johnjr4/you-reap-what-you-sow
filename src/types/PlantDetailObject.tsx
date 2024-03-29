import DefaultImageObject from "./DefaultImageObject";

// The full plant object returned from a "Plant Details" call to perenual
type PlantDetailObject = {
    "id": number,
    "common_name": string,
    "scientific_name": [string],
    "other_name": [string],
    "family": string,
    "origin": [string],
    "type": string,
    "dimensions": any,
    "cycle": string,
    "watering": string,
    "depth_water_requirement": any,
    "volume_water_requirement": any,
    "watering_period": string,
    "watering_general_benchmark": any,
    "plant_anatomy": [any],
    "sunlight": [string],
    "pruning_month": [string],
    "pruning_count": any,
    "seeds": number,
    "attracts":[string],
    "propagation":[string],
    "hardiness": any,
    "hardiness_location": any,
    "flowers": boolean,
    "flowering_season": string,
    "color": string,
    "soil": [any],
    "pest_susceptibility": any,
    "cones": boolean,
    "fruits": boolean,
    "edible_fruit": boolean,
    "fruit_color": any,
    "fruiting_season": any,
    "harvest_season": any ,
    "harvest_method": string,
    "leaf": boolean,
    "leaf_color": [string],
    "edible_leaf": boolean,
    "growth_rate": string,
    "maintenance": string,
    "medicinal": boolean,
    "poisonous_to_humans": boolean,
    "poisonous_to_pets": boolean,
    "drought_tolerant": boolean,
    "salt_tolerant": boolean,
    "thorny": boolean,
    "invasive": boolean,
    "rare": boolean,
    "rare_level": string,
    "tropical": boolean,
    "cuisine": boolean,
    "indoor": boolean,
    "care_level": string,
    "description": string,
    "default_image": DefaultImageObject
}

export default PlantDetailObject;