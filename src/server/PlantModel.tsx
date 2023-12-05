import mongoose from './db';

const plantSchema = new mongoose.Schema({
  id: Number,
  common_name: String,
  scientific_name: String,
  cycle: String,
  watering: String,
  default_image: mongoose.Schema.Types.Mixed,
});

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;