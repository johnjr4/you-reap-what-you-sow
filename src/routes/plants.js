
const Plant = require('../models/plantdetail')
const User = require('../models/user')
const Reminder = require('../models/reminder')

module.exports = function (router) {
    router.get('/plants', async (req, res) => {
        try{
            const whereQuery = req.query.where ? JSON.parse(req.query.where): {};
            const count = req.query.count || false;
            const sort = req.query.sort ? parseSortString(req.query.sort) : {};
            const selectFields = req.query.select ? JSON.parse(req.query.select) : {};
            const skip = parseInt(req.query.skip) || 0;
            const limit = req.query.limit ? parseInt(req.query.limit) : 100;
            const plants = await Plant.find().where(whereQuery).select(selectFields).sort(sort).skip(skip).limit(limit).exec();

            if (count === 'true'){
                res.json({message: "Success", data: plants.length});
            }
            else{
                res.json({message: "Success", data: plants})
            }
            
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", data: ""})
        }
    })

    // POST
    // Create a new plant.Respond with details of new plant
    router.post('/plants', async (req, res) => {
        try {
            // Check if 'id' and 'common_name' are provided in the request
            if (!req.body.id || !req.body.common_name) {
                return res.status(400).json({ message: 'Id and common name are required' , data: ""});
            }

            const plant = new Plant({
                id: req.body.id,
                common_name: req.body.common_name,
                scientific_name: req.body.scientific_name,
                cycle: req.body.cycle,
                watering: req.body.watering,
                default_image: req.body.default_image
                // Add more default values here
            });

            // Save the plant to the database
            await plant.save();
            res.status(201).json({message: "Created plant", data: plant}); // Respond with the created plant
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message, data: "" });
        }
    })

    // tasks /: id
    // GET
    //GOOD
    // Respond with details of specified plant or 404 error
    router.get('/plants/:id', async(req, res) => {
        try {
            const selectFields = req.query.select ? JSON.parse(req.query.select) : {};
            const plant = await Plant.findOne({id: req.params.id}).select(selectFields).exec();
            if (!plant) {
                return res.status(404).json({ message: 'No plant found', data: '' });
            }
            res.json({ message: 'Plant found', data: plant });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', data: '' });
        }
    })


    // PUT
    // Replace entire plant with supplied plant or 404 error
    router.put('/api/plants/:id', async (req, res) => {
        try {
            const plantId = req.params.id;
            const updatedPlantData = req.body;
            const plant = await Plant.findById(plantId);
        
            if (!plant) {
              return res.status(404).json({ message: 'User not found', data: '' });
            }
            Object.assign(plant, updatedPlantData);
            const updatedPlant = await plant.save();
            res.json({ message: 'Updated Plant', data: updatedPlant });
          } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', data: '' });
          }
    })



    // DELETE
    // Delete specified user or 404 error
    //GOOD
    router.delete('/api/plants/:id', getPlant, async (req, res) => {
        try {
            await res.plant.remove()
            res.json({message: "Deleted Plant", data: ""})
        } catch (error){
            res.status(500).json({message: error.message, data: ""})
        }
    })


    router.get('/users', async (req, res) => {
        try{
            const whereQuery = req.query.where ? JSON.parse(req.query.where): {};
            const count = req.query.count || false;
            const sort = req.query.sort ? parseSortString(req.query.sort) : {};
            const selectFields = req.query.select ? JSON.parse(req.query.select) : {};
            const skip = parseInt(req.query.skip) || 0;
            const limit = req.query.limit ? parseInt(req.query.limit) : 100;
            const users = await User.find(whereQuery).select(selectFields).sort(sort).skip(skip).limit(limit).exec();

            if (count === 'true'){
                res.json({message: "Success", data: users.length});
            }
            else{
                res.json({message: "Success", data: users})
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', data: ""})
        }
    })
    // POST
    // Create a new user.Respond with details of new user
    router.post('/api/users', async (req, res) => {
        try {
            // Check if 'name' and 'email' are provided in the request
            if (!req.body.name || !req.body.email) {
                return res.status(400).json({ message: 'Name and email required' , data: ""});
            }
            // Check if a user with the same email already exists
            let existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists', data: "" });
            }

            // existingUser = await User.findOne({id: req.body.id});
            // if (existingUser) {
            //     return res.status(400).json({message: 'User with this id already exists', data: ""})
            // }
            // Create a new user with specified fields and default values for others
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                id: req.body.id,
                // Set default values for other fields as needed
                picture_path: req.body.picture_path || "",
                plants: req.body.plants || [],
                reminders: req.body.reminders || []
            });
            // Save the user to the database
            await user.save();
            res.status(201).json({message: "Created user", data: user}); // Respond with the created user
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message, data: "" });
        }
    });

    // Add a plant to a specific users list of plants
    router.post('/users/:id/:plantid', async (req, res) => {
        try {
            const user = await User.findOne({id: req.params.id});
            if (!user) {
                res.status(404).json({message: "Person not found", data: ""});
                return;
            }
            user.plants.push(Number(req.params.plantid));
            user.save();
            res.json({message: "Plant added to user's list", data: user});
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error', data: ""})
        }
    });

    // users /: id
    // GET
    // Respond with details of specified user or 404 error
    router.get('/api/users/:id', async (req, res) => {
        try {
            const selectFields = req.query.select ? JSON.parse(req.query.select) : {};
            const user = await User.findOne({id: req.params.id}).select(selectFields);
            if (!user) {
                return res.status(404).json({ message: 'No user found', data: "" });
            }
            res.json({ message: "User found", data: user });
        } catch (error) {
            res.status(500).json({ message: error.message, data: "" });
        }
    })
    // PUT
    // Replace entire user with supplied user or 404 error
    router.put('/api/users/:id', async (req, res) => {
        try {
            const userId = req.params.id;
            const updatedUserData = req.body;
            const userEmail = req.body.email;
            const userName = req.body.name;


            // First check if there is a user with the same id field (created by firebase)
            const existingUser = await User.findOne({id: req.params.id});
            if (existingUser) {
                return res.status(400).json({message: 'User with this id (firebase) already exists', data: ""})
            }

            // We know that the user is not in this DB but has been assigned a firebase id, so find by email and username. In this case, the passed req.params.id can be anything
            const user = await User.findOne({email: userEmail, name: userName});
        
            // Check if the user exists
            if (!user) {
              return res.status(404).json({ message: 'User not found', data: '' });
            }
        
            // Update the user properties
            Object.assign(user, updatedUserData);
        
            // Save the updated user
            const updatedUser = await user.save();
        
            res.json({ message: 'Updated User', data: updatedUser });
          } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error', data: '' });
          }
    })

    // DELETE
    // Delete specified user or 404 error
    router.delete('/api/users/:id', getUser, async (req, res) => {
        try {
            await User.deleteOne({"id": req.params.id });
            res.json({message: "Deleted User", data: ""});
        } catch (error){
            res.status(500).json({message: error.message, data: ""})
        }
    })


    //Reminder

    router.get('/reminders', async (req, res) => {
        try{
            const whereQuery = req.query.where ? JSON.parse(req.query.where): {};
            const count = req.query.count || false;
            const sort = req.query.sort ? parseSortString(req.query.sort) : {};
            const selectFields = req.query.select ? JSON.parse(req.query.select) : {};
            const skip = parseInt(req.query.skip) || 0;
            const limit = req.query.limit ? parseInt(req.query.limit) : 100;
            const reminders = await Reminder.find(whereQuery).select(selectFields).sort(sort).skip(skip).limit(limit).exec();
            if (count === 'true'){
                res.json({message: "Success", data: reminders.length});
            }
            else{
                res.json({message: "Success", data: reminders})
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', data: ""})
        }
    })
    // POST
    // Create a new reminder.Respond with details of new reminder
    router.post('/api/reminders', async (req, res) => {
        try {
            // Check if 'plant_name' is provided in the request
            if (!req.body.plant_name) {
                return res.status(400).json({ message: 'Plant_name is required' , data: ""});
            }
            // Create a new reminder with specified fields and default values for others
            const reminder = new Reminder({
                id: req.body.id,
                plant_name: req.body.plant_name,
                date: req.body.date || Date.now(),
                frequency: req.body.frequency,
            });
            // Save the reminder to the database
            await reminder.save();
            res.status(201).json({message: "Created user", data: reminder}); // Respond with the created reminder
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message, data: "" });
        }
    })
    // users /: id
    // GET
    // Respond with details of specified user or 404 error
    router.get('/api/reminders/:id', async (req, res) => {
        try {
            const selectFields = req.query.select ? JSON.parse(req.query.select) : {};
            const reminder = await Reminder.findById(req.params.id).select(selectFields).exec();
            if (!reminder) {
                return res.status(404).json({ message: 'No reminder found', data: "" });
            }
            res.json({ message: "User found", data: reminder });
        } catch (error) {
            res.status(500).json({ message: error.message, data: "" });
        }
    })
    // PUT
    // Replace entire reminder with supplied user or 404 error
    router.put('/api/reminders/:id', async (req, res) => {
        try {
            const reminderId = req.params.id;
            const updatedReminderData = req.body;
            // Find the reminder by ID
            const reminder = await Reminder.findById(reminderId);
        
            // reminder if the user exists
            if (!reminder) {
              return res.status(404).json({ message: 'User not found', data: '' });
            }
        
            // Update the user properties
            Object.assign(reminder, updatedReminderData);
        
            // Save the updated user
            const updatedReminder = await reminder.save();
        
            res.json({ message: 'Updated User', data: updatedReminder });
          } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error', data: '' });
          }
    })
    // DELETE
    // Delete specified user or 404 error
    router.delete('/api/reminders/:id', getReminder, async (req, res) => {
        try {
            await res.reminder.remove()
            res.json({message: "Deleted User", data: ""})
        } catch (error){
            res.status(500).json({message: error.message, data: ""})
        }
    })
    async function getUser(req, res, next) {
        let user
        try {
            user = await User.findById(req.params.id)
            if (user == null) {
                return res.status(404).json({message: "No user found", data: ""})
            }
        } catch (error){
            return res.status(500).json({ message: error.message, data: ""})
        }
        res.user = user
        next()
    }

    async function getPlant(req, res, next) {
        let plant
        try {
            plant = await Plant.findById(req.params.id)
            if (plant == null) {
                return res.status(404).json({message: "No plant found", data: ""})
            }
        } catch (error){
            return res.status(500).json({ message: error.message, data: ""})
        }
        res.plant = plant
        next()
    }

    async function getReminder(req, res, next) {
        let reminder
        try {
            reminder = await Reminder.findById(req.params.id)
            if (plant == null) {
                return res.status(404).json({message: "No reminder found", data: ""})
            }
        } catch (error){
            return res.status(500).json({ message: error.message, data: ""})
        }
        res.reminder = reminder
        next()
    }
    return router
}

function parseSortString(sortString) {
    try {
        // Parse the sort string as JSON
        const sortObj = JSON.parse(sortString);
        // Convert the sort object into the format expected by Mongoose
        const mongooseSort = {};
        for (const key in sortObj) {
            const sortOrder = sortObj[key];

            if (sortOrder === 1 || sortOrder === -1) {
              mongooseSort[key] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }
    
        return mongooseSort;
      } catch (error) {
        console.error('Error parsing sort string:', error);
        return {};
      }
    }

//module.exports = router
