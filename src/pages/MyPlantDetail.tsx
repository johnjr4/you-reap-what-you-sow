import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import page1 from '../dev/page1.json';
import test_users from '../dev/test_users.json'
import no_img from '../images/no_img.jpg';
import UserObject from '../types/UserObject';
import PlantObject from '../types/PlantObject';
import GetTestPlantData3 from '../dev/parse_plant_json.tsx';
import GetTestReminderData3 from '../dev/parse_reminder_json.tsx';

const defaultPlant = {
    id: -1,
    common_name: "Not a real plant",
    scientific_name: "You screwed up",
    cycle: "nope",
    watering: "nuh-uh",
    default_image: no_img
}

function MyPlantDetail() {
    const { userId, plantId } = useParams();
    console.log(`user ${userId} plant ${plantId}`)
    const [ plantObj, setPlantObj ] = useState<PlantObject>(defaultPlant);
    const [isLoading, setLoading] = useState(true);
    const [isFailed, setFailed] = useState(false);


    useEffect(() => {
        // TODO: Replace with API call
        const fetchPlantData = async () => {
            let plantData = page1.find(plant => plant.id === Number(plantId));
            setLoading(false);
            if (plantData) {
                setPlantObj({
                    id: plantData.id,
                    common_name: plantData.common_name,
                    scientific_name: plantData.scientific_name[0],
                    cycle: plantData.cycle,
                    watering: plantData.watering,
                    default_image: plantData.default_image ? plantData.default_image.original_url : no_img,
                });
                const response = await fetch(`http://localhost:3000/plants/${plantId}`);
                if (!response.ok) {
                    throw new Error('Plant not found');
                }
                const testServerPlants = await response.json();
                console.log(JSON.stringify(testServerPlants));
            } else {
                setFailed(true);
            }
        };
        fetchPlantData();
    }, [plantId]);

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (isFailed) {
        return (
            <div>
                {`Plant ${plantId} not found :(`}
            </div>
        )
    }

    return (
        <div>
            <h1>
                User #{userId}
            </h1>
            <h1>
                Plant #{plantId}: {plantObj.common_name}
            </h1>
            <div className='AddPlant-form'>
                <button className='add-button'>
                    {/* <img
                        className='button-icon'
                        src= '../logo192.png'
                        alt='filter icon'
                    /> */}
                    
                    <label>Add to My Plants</label>

                </button>
            </div>

            <img src={plantObj.default_image} alt={plantObj.common_name}/>
        </div>
    );
}

function AddPlantToUser(props :{userId:any, plantId:any}) {
    const userId = props.userId;
    const plantId = props.plantId;
    const [ plantObj, setPlantObj ] = useState<PlantObject>();
    const [userObj, setUserObj] = useState<UserObject>();
    const [isLoading, setLoading] = useState(true);
    const [isFailed, setFailed] = useState(false);

    // convert to axios api get and put requests
    let plantQuery = page1.find(plant => plant.id === Number(plantId));
    if (plantQuery) {
        setPlantObj({
            id: plantQuery.id,
            common_name: plantQuery.common_name,
            scientific_name: plantQuery.scientific_name[0],
            cycle: plantQuery.cycle,
            watering: plantQuery.watering,
            default_image: plantQuery.default_image ? plantQuery.default_image.original_url : no_img,
        });
    } else {
        setFailed(true);
    }
    let userQuery = test_users.find(user => user.id === Number(userId));
    if (userQuery) {
        setUserObj({
            id: userQuery.id,
            name: userQuery.name,
            email: userQuery.email,
            picture_path: userQuery.picture_path,
            plants: GetTestPlantData3(userQuery.plants),
            reminders: GetTestReminderData3(userQuery.reminders)
        })
    }
    if (userObj && plantObj) {
        const updatedUserObj: UserObject = {
            ...userObj,
            plants: [...userObj.plants, plantObj]
        };

        // Update the state with the new user object
        setUserObj(updatedUserObj);

        // Save the updated user object to test_users.json (you'll need a function for this)
        // saveUpdatedUserObjToJSON(updatedUserObj);
    }
}
// function writeToJSON() {
//     const fs = require("fs");

//     // the .json file path
//     const JSON_FILE = "user.json";

//     try {
//     // reading the JSON file
//     const jsonData = fs.readFileSync(JSON_FILE);

//     // parsing the JSON content
//     const user = JSON.parse(jsonData);

//     // adding the "completeName" field to
//     // JavaScript representation of the
//     // "user.json" file
//     data["completeName"] = `${user.firstName} ${user.lastName}`;

//     // updating the JSON file
//     fs.writeFileSync(JSON_FILE, data);
//     } catch (error) {
//     // logging the error
//     console.error(error);

//     throw error;
//     }
// }

// function saveUpdatedUserObjToJSON(props: {updatedUserObj: UserObject}) {
//     const updatedUserObj = props.updatedUserObj;
//     // Find the index of the user object in the test_users array
//     const index = test_users.findIndex(user => user.id === updatedUserObj.id);

//     if (index !== -1) {
//         // Update the test_users array with the modified user object
//         const updatedTestUsers = [...test_users];
//         updatedTestUsers[index] = updatedUserObj;

//         // Save the updated array to your JSON file (you'll need a function for this)
//         saveArrayToJSON(updatedTestUsers);
//     }
// }

export default MyPlantDetail;