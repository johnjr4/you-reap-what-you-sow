import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import page1 from '../dev/compiled_responses1.json';
import test_users from '../dev/test_users.json';
import no_img from '../images/no_img.jpg';
import PlantObject from '../types/PlantObject';
import UserObject from '../types/UserObject.tsx';
import GetTestPlantData3 from '../dev/parse_plant_json.tsx';
import GetTestReminderData3 from '../dev/parse_reminder_json.tsx';
import './PlantDetail.scss';
import PlantDetailObject from '../types/PlantDetailObject.tsx';
import axios from 'axios';

const defaultPlant = {
  id: -1,
  common_name: "Not a real plant",
  scientific_name: "You screwed up",
  cycle: "nope",
  watering: "nuh-uh",
  default_image: no_img
}

const apiKey = "sk-8CuD6569732e1585c3236";

function PlantDetail() {
  const { userId, plantId } = useParams();
  console.log(`user ${userId} plant ${plantId}`)
  const [ plantObj, setPlantObj ] = useState<PlantDetailObject>();
  const [isLoading, setLoading] = useState(true);
  const [isFailed, setFailed] = useState(false);


  useEffect(() => {
      // TODO: Replace with API call
      const fetchPlantData = async () => {
          // Dummy JSON data
          let plantData = page1.find(plant => plant.id === 100);
          // Real plant API call
          // let plantData = await axios.get(`https://perenual.com/api/species/details/${plantId}?key=${apiKey}`)
          if (plantData) {
            // setPlantObj({
            //   id: plantData.id,
            //   common_name: plantData.common_name,
            //   scientific_name: plantData.scientific_name[0],
            //   cycle: plantData.cycle,
            //   watering: plantData.watering,
            //   default_image: plantData.default_image ? plantData.default_image.original_url : no_img,
            // });
            console.log(plantData);
            setPlantObj(plantData);
            // setPlantObj(plantData.data);
          } else {
            setFailed(true);
          }
          setLoading(false);
      };
      fetchPlantData();
  }, [plantId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isFailed) {
    return <div>{`Plant ${plantId} not found :(`}</div>;
  }

  return (
    <div className="plant-detail">
      <img className="detail-image" src={plantObj!.default_image.original_url} alt={plantObj!.common_name}/>
      <div className="plant-details">
        <div className="detail-header">
          <h2 className="detail-title"> 
            Plant #{plantId}: {plantObj!.common_name}
          </h2>
          <span className='plant-species'><i>{plantObj!.scientific_name}</i></span>
        </div>
        <div className='detail-description'>
          {plantObj!.description}
        </div>
        <ul className='detail-stats'>
          <li key="type"      >Type: {plantObj!.type}</li>
          <li key="cycle"     >Cycle: {plantObj!.cycle}</li>
          <li key="watering"  >Watering: {plantObj!.watering}</li>
          <li key="flowers"   >Flowers: {plantObj!.flowers ? "Yes" : "No"}</li>
          <li key="fruits"    >Fruits: {plantObj!.fruits ? "Yes" : "No"}</li>
          <li key="invasive"  >Invasive: {plantObj!.invasive ? "Yes" : "No"}</li>
          <li key="indoor"    >Indoor: {plantObj!.indoor ? "Yes" : "No"}</li>
          <li key="care_level">Care level: {plantObj!.care_level ? "Yes" : "No"}</li>
        </ul>
      </div>
    </div>
  );
}
export default PlantDetail

function GetPrevDetail(plantId) {
  if (plantId === 1) {
    return 1;
  }
  return plantId - 1;
}
function GetNextDetail(plantId) {
 // temp 
  if (plantId === 30) {
    return 30;
  }
  return plantId + 1;
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
  let userQuery = updated_users.find(user => user.id === String(userId));
  if (userQuery) {
      setUserObj({
        id: userQuery.id,
        name: userQuery.name,
        email: userQuery.email,
        picture_path: userQuery.picture_path ? userQuery.picture_path : no_img,
        plants: userQuery.plants,
        reminders: ReminderJSON_to_Obj(userQuery.reminders)
      })
  }
  if (userObj && plantObj) {
      const updatedUserObj: UserObject = {
          ...userObj,
          plants: [...userObj.plants, plantObj.id]
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

