import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import no_img from '../images/no_img.jpg';
import PlantObject from '../types/PlantObject.tsx';
import UserObject from '../types/UserObject.tsx';
import ReminderObject from '../types/ReminderObject.tsx';
import page1 from '../dev/page1.json';
import test_users from '../dev/test_users.json';
import updated_users from '../dev/updated_users.json';
import GetTestPlantData3 from '../dev/GetTestPlantData3.tsx';
import GetTestReminderData3 from '../dev/GetTestReminderData3.tsx';
import ReminderJSON_to_Obj from '../dev/ReminderJSON _to_Obj.tsx';
import PlantIdArr_to_PlantObjArr from '../dev/PlantIdArr_to_PlantObjArr.tsx';
import { auth, db, logout } from "../firebase";
import { User } from "firebase/auth";
import Fuse from 'fuse.js';


function GetUserData2(data) {
    const [isLoading, setLoading] = useState(true);
    const [isFailed, setFailed] = useState(false);
    const [userObj, setUserObj] = useState<UserObject>();
    const { userId} = useParams();

    useEffect(() => {
        // Simulating an asynchronous operation (loading from JSON file)
        const fetchUserData = async () => {
            try {
                let userQuery = updated_users.find(user => user.id === String(userId));
                setLoading(false);
                if (userQuery) {
                    // console.log(userQuery);
                    setUserObj({
                        id: userQuery.id,
                        name: userQuery.name,
                        email: userQuery.email,
                        picture_path: userQuery.picture_path ? userQuery.picture_path : no_img,
                        plants: userQuery.plants,
                        reminders: ReminderJSON_to_Obj(userQuery.reminders)
                    });
                } else {
                    setFailed(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, [data, userId]);

    if (isFailed) {
        return <div>Failed to load profile</div>;
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='Dashboard'>
            {/* <p>{`userId: ${userId}`}</p> */}
            {/* <p>{JSON.stringify(userObj)}</p> */}
            <div className='Dashboard-top-half'>
                <MyProfile user={userObj}/>
                <Reminders user={userObj}/>
            </div>
            <div className='Dashboard-bottom-half'>
                <MyPlants user={userObj}/>
                <AddPlants userObject={userObj} setUserObject={setUserObj}/>
            </div>
        </div>
    );
}
export default function Dashboard() {
    return (
        // <div className='Dashboard'>
        //     <div className='Dashboard-top-half'>
        //         <MyProfile user={test_user_loaded}/>
        //         <AddPlants />
        //     </div>
        //     <div className='Dashboard-bottom-half'>
        //         <Reminders user={test_user_loaded}/>
        //         <MyPlants user={test_user_loaded}/>
        //     </div>
        // </div>
        // <div><GetUserData data={test_users} /></div>
        <div><GetUserData2 data={updated_users} /></div>
    );
}

function MyProfile(props: {user : UserObject}) {
    const user = props.user;
    return(
        <div className="MyProfile-container">
            <div className="profile-pic">                
                <img
                    className='profile-pic'
                    src={user.picture_path}
                    alt={'Profile'}
                />
            </div>
            <div className="profile-info">
                <span className='profile-header'>My Profile </span>
                <ul className="profile-info-data">
                    <li>{user.name}</li>
                    <li>{user.email}</li>
                </ul>
            </div>
            {/* <div className='profile-management'>
                <button className='buttons'>Edit Profile</button>
                <button className='buttons' onClick={logout}>Log Out</button>
            </div> */}
        </div>
    );
}
function MyPlants(props: {user:UserObject}) {
    const user = props.user;
    const [isLoading, setLoading] = useState(true);
    const [isFailed, setFailed] = useState(false);
    const [plantObjs, setPlantObjects] = useState<PlantObject[]>([])
    const [filterNum, setFilterNum] = useState(0);
    const [viewMode, setViewMode] = useState('list');
    const filters = ['Annuals', 'Perennials', 'Biennials', 'Vegetables', 'Trees', 'Flowers']
    const data = page1;
    // replace with api call. Fetches all plants from user's plant list of plantIds
    useEffect(() => {
        const fetchPlantData = async () => {
          try {
            let fetchedPlantObjArr:PlantObject[] = [];
            for (const plantId of user.plants) {
              let plantData = data.find((plant) => plant.id === Number(plantId));
              if (plantData) {
                fetchedPlantObjArr.push({
                  id: plantData.id,
                  common_name: plantData.common_name,
                  scientific_name: plantData.scientific_name[0],
                  cycle: plantData.cycle,
                  watering: plantData.watering,
                  default_image: plantData.default_image
                    ? plantData.default_image.regular_url
                    : no_img,
                });
              } else {
                setFailed(true);
              }
            }
            setPlantObjects(fetchedPlantObjArr);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching plant data:', error);
            setLoading(false);
            setFailed(true);
          }
        };
        fetchPlantData();
    }, [user, data]);

    function selectFilter(idx) {
        if (filterNum === idx) {
            setFilterNum(0); // Turn filters off
        } else {
            setFilterNum(idx);
        }
    }
    if (isFailed) {
        return (
            <div>Failed to load plants</div>
        );
    }
    if (isLoading) {
        return (
            <div>
                Loading your plants...
            </div>
        );
    } else {
        return (
            <div className='MyPlants-container'>
                <span className='MyPlants-title'>My Plants</span>
                <div className="MyPlants-header">
                    <div className='view-toggle'>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                    </div>
                    <div className='MyPlants-gallery-filters'>
                        {filters.map((filter, idx) => {
                            return <button
                                style={filterNum === idx + 1 ? {"backgroundColor": "lightgreen"} : {}}
                                onClick={() => selectFilter(idx + 1)}
                                className='MyPlants-gallery-filter-btn'
                            >{filter}</button>
                        })}
                    </div>
                </div>
                {viewMode === 'list' ? (
                    <div className="plant-list">
                        <div className="plant-list-header">
                            <span className="label-picture">Picture</span>
                            <span className="label-name">Name</span>
                            <span className="label-cycle">Cycle</span>
                            <span className="label-watering">Watering</span>
                        </div>
                        {plantObjs.map((plant: PlantObject) => {
                            if (plantFilter(filterNum, plant)) {
                                return (
                                    <ListItem plant={plant} />
                                );
                            } else {
                                return null;
                            }
                        })}
                    </div>
                ) : (
                    <ul className='MyPlants-masonry'>
                        {plantObjs.map((p: PlantObject) => {
                            if (plantFilter(filterNum, p)) {
                                return <li key={p.id}><GalleryListItem plant={p} /></li>
                            } else {
                                return null;
                            }
                        })}
                    </ul>                    
                )}
            </div>            
        );
    }

}
function ListItem(props: {plant: PlantObject}) {
    const plant = props.plant
    const { userId } = useParams();
    return (
        <Link to={`/user/${userId}/detail/${plant.id}`} className='list-link' key={plant.id}>
            <div className="list-row">
                <img
                    className='plant-pic'
                    src={plant.default_image}
                    alt={`${plant.common_name}`}
                />
                <span className="common-name">{plant.common_name}</span>
                <span className="cycle">{plant.cycle}</span>
                <span className="watering">{plant.watering}</span>

            </div>
        </Link>
    );        
}
function GalleryListItem(props: {plant : PlantObject}) {
    const plant = props.plant
    const { userId } = useParams();
    return (
        <Link to={`/user/${userId}/detail/${plant.id}`}>
            <div className='MyPlants-plant-card'>
                <div className='MyPlants-plant-des'>
                    <h3 className='MyPlants-plant-name'>{`#${plant.id}: ${plant.common_name}`}</h3>
                    <p className='MyPlants-plant-species'><i>{plant.scientific_name}</i></p>
                </div>
                <img src={plant.default_image} alt={plant.common_name}/>
            </div>
        </Link>
    );
}

function ViewToggle( {viewMode, setViewMode} ) {
    return (
      <div className='toggle-switch'>
        <label>
          <input
            type="radio"
            value="list"
            checked={viewMode === 'list'}
            onChange={() => setViewMode('list')}
          />
          List
        </label>
        <label>
          <input
            type="radio"
            value="gallery"
            checked={viewMode === 'gallery'}
            onChange={() => setViewMode('gallery')}
          />
          Gallery
        </label>        
      </div>
    );
  }

function plantFilter(idx, plant) {
    // console.log(`Checking ${plant} against filter ${idx}`);
    // console.log(plant);
    switch (idx) {
        case 1:
            return plant.cycle === "Annual"
            break;
        case 2:
            return plant.cycle === "Perennial"
            break;
        case 3:
            return plant.cycle === "Biennial"
            break;
        case 4:
            return plant.type === "vegetable";
        case 5:
            return plant.type === "trees";
        case 6:
            return plant.flowers;
        default:
            return true; // 0
    }
}


function MyPlantsGalleryView(props: { my_plants: Array<PlantObject> }) {
  const my_plants = props.my_plants;
  return (
    <div>
      <div className="gallery-filters">
        <button type="button" className="gallery-filter-btn">
          Annuals
        </button>
        <button type="button" className="gallery-filter-btn">
          Perennials
        </button>
        <button type="button" className="gallery-filter-btn">
          Biennials
        </button>
        <button type="button" className="gallery-filter-btn">
          Vegetables
        </button>
        <button type="button" className="gallery-filter-btn">
          Flowers
        </button>
        <button type="button" className="gallery-filter-btn">
          Trees
        </button>
      </div>
      <ul className="masonry">
        {my_plants.map((p, index) => {
          return (
            <li key={index}>
              <GalleryListItem plant={p} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
function GalleryListItem(props: { plant: PlantObject }) {
  const plant = props.plant;
  const { userId } = useParams();
  return (
    <Link to={`/user/${userId}/detail/${plant.id}`}>
      <div className="plant-card">
        <div className="plant-des">
          <h3 className="plant-name">{`#${plant.id}: ${plant.common_name}`}</h3>
          <p className="plant-species">
            <i>{plant.scientific_name}</i>
          </p>
        </div>
        <img src={plant.default_image} alt={plant.common_name} />
      </div>
    </Link>
  );
}
function RemindersListView(props: {reminders:Array<ReminderObject>}) {
    const reminders = props.reminders;
    const currentDate = new Date();
    let reminderMessages:Array<string> = [];
    reminders.forEach(reminder => {
        const dateCreated = new Date(reminder.date);
        const timeDifference = currentDate.getTime() - dateCreated.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        if (reminder.frequency !== 0 && daysDifference % reminder.frequency === 0) {
            reminderMessages.push(`Today's the day to water your ${reminder.plant_name} plants!`);
        }
    });
    
    if (reminderMessages.length === 0) {
        reminderMessages = ['No reminders for today.'];
    }
  });

  if (reminderMessages.length === 0) {
    reminderMessages = ["No reminders for today."];
  }

  return (
    <div className="reminder-list">
      {reminderMessages.map((reminderMessage) => (
        <div className="list-row" key={reminderMessage}>
          <span className="reminder-text">{reminderMessage}</span>
        </div>
      ))}
    </div>
  );
}


function AddPlants({userObject, setUserObject}) {
    const [isLoading, setLoading] = useState(true);
    const [plantObjs, setPlantObjects] = useState<PlantObject[]>([])
    const [plantFuse, setPlantFuse] = useState<Fuse>();
    const [query, setQuery] = useState("");
    const { userId } = useParams();
    // const AddPlantToUserTest2 = (plantId) => {
    //     console.log(`clicked add plant to user ${userId}`);
    // };
    function AddPlantToUserTest(plantId) {
        // locally adds to the plants array, change to add thru api
        console.log(`clicked add plant ${plantId} to user ${userId}`);
        console.log(userObject.plants);
        setUserObject({
            ...userObject,
            plants: [...userObject.plants, plantId]
        })
        console.log(userObject.plants);
    }

    useEffect(() => {
        // axios.get(`https://perenual.com/api/species-list?key=${apiKey}&page=1`) 
        // .then( async response => {
            // // console.log(response);
            // const plantResponse = response.data.data.map((plant: any)=> {
                //     // console.log('heere! 25')
                //     return {
                    //     id: plant.id,
                    //     common_name: plant.common_name,
                    //     scientific_name: plant.scientific_name[0],
                    //     default_image: plant.default_image ? plant.default_image.original_url : no_img,
                    
                    //     }
                    // });
                    // //console.log(plantResponse)
        // setPlantObjects(plantResponse);
        // setLoading(false);
        // })
        // .catch(() => {
        //     console.log('you messed up')
        // });

        // Uncomment above and delte below! Local JSON is just for developing UI without burning through API calls
        const plantResponse = page1.map((plant: any) => {
            return {
                id: plant.id,
                common_name: plant.common_name,
                scientific_name: plant.scientific_name[0],
                default_image: plant.default_image ? plant.default_image.original_url : no_img,
                cycle: plant.cycle,
                watering: plant.watering
            }
        });
        setPlantObjects(plantResponse);
        const fuse = new Fuse(plantResponse, {
            keys: ['common_name']
        })
        setPlantFuse(fuse);
        setLoading(false);
        // End dev test code
    }, []);
    
    if (isLoading) {
        return (
            <div>Loading</div>
        );
    } else {
        return (
            <div className='AddPlants-container'>
                <span className='Add-Plants-title'>Add Plants</span>
                <div className='AddPlants-by-search'>
                    <input 
                        type='text'
                        id='search-bar'
                        placeholder='Search for a plant to add...'
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <ul className='AddPlants-search-results-list'>
                        {query !== "" ? (
                            plantFuse.search(query).map((p:any) => {
                                return (
                                    <li key={p.id}>
                                        <button 
                                            className='AddPlants-search-result' 
                                            onClick={() => AddPlantToUserTest(p.item.id)}
                                        >
                                            <label>{p.item.common_name}</label>
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <div></div>
                        )}
                    </ul>
                    <div className='AddPlants-by-gallery'>
                        <Link to='gallery' className='AddPlants-link'>
                            Add a plant from the gallery page.
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
