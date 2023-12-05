import express, { Request, Response } from 'express';
import Plant from './PlantModel';

const app = express();
const port = 4000;

app.use(express.json());

// Get a specific number of plants
app.get('/plants', async (req: Request, res: Response) => {
  try {
    const numberOfPlants = req.query.number || 10; // Default to 10 plants if not specified
    const plants = await Plant.find().limit(Number(numberOfPlants));
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get plant details by ID
app.get('/plants/:id', async (req: Request, res: Response) => {
  try {
    const plantId = req.params.id;
    const plant = await Plant.findOne({ id: plantId });
    
    if (plant) {
      res.json(plant);
    } else {
      res.status(404).json({ error: 'Plant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});