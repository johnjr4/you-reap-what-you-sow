import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://akuma9:409final@cluster0.nqrauy3.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

export default mongoose;