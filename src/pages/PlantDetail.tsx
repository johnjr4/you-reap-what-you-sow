import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import page1 from '../dev/compiled_responses1.json';
import test_users from '../dev/test_users.json';
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
  default_image: '/no_img.jpg'
}

function PlantDetail() {
  const { userId, plantId } = useParams();
  console.log(`user ${userId} plant ${plantId}`)
  const [ plantObj, setPlantObj ] = useState<PlantDetailObject>();
  const [added, setAdded] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isFailed, setFailed] = useState(false);


  useEffect(() => {
      try {
        const fetchPlantData = async () => {
            let plantData = await axios.get(`http://localhost:4001/api/plants/${plantId}`);
            let userData = await axios.get(`http://localhost:4001/api/users/${userId}`);
            if (plantData && userData) {
              console.log(plantData);
              setPlantObj(plantData.data.data);
              console.log(userData.data.data.plants);
              console.log(`Does it include ${plantId}?`);
              if (userData.data.data.plants.includes(Number(plantId))) {
                console.log("setting added");
                setAdded(true);
              }
            } else {
              setFailed(true);
            }
            setLoading(false);
        };
        fetchPlantData();
      } catch (err) {
        console.log(err);
      }
  }, [plantId]);

  async function addPlantToUser() {
    try {
      await axios.post(`http://localhost:4001/api/users/${userId}/${plantId}`);
      setAdded(true);
    } catch (err) {
      console.log(err);
    }
  }

  async function removePlantFromUser() {
    try {
      await axios.delete(`http://localhost:4001/api/users/${userId}/${plantId}`);
      setAdded(false);
    } catch(err) {
      console.log(err);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isFailed) {
    return <div>{`Plant ${plantId} not found :(`}</div>;
  }

  return (
    <div className="plant-detail-wrapper">
      <div className="plant-detail">
        <img className="detail-image"
          src={plantObj!.default_image ?
            plantObj!.default_image.original_url
            :
            '/no_img.jpg'
          }
          alt={plantObj!.common_name}
          />
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
            <li key="care_level">Care level: {plantObj!.care_level}</li>
          </ul>
        </div>
      </div>
      <button
        className={`add-plant-btn ${added? 'yeah' : 'no'}`}
        onClick={!added ? () => addPlantToUser() : () => removePlantFromUser()}
      >
        <img
          className="add-plant-img"
          src={added ? '/add_check.svg' : '/add_plus.svg'}
        />
        <img
          className="rem-plant-img"
          src={added ? '/delete_x.svg' : '/add_plus.svg'}
        />
      </button>
    </div>
  );
}
export default PlantDetail