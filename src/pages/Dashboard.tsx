import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import no_img from '../images/no_img.jpg';
import PlantObject from '../types/PlantObject.tsx';
import UserObject from '../types/UserObject.tsx';
import ReminderObject from '../types/ReminderObject.tsx';
import page1 from '../dev/page1.json'
import test_users from '../dev/test_users.json'
import GetTestPlantData3 from '../dev/parse_plant_json.tsx';
import GetTestReminderData3 from '../dev/parse_reminder_json.tsx';
import { auth, db, logout } from "../firebase";


// function GetTestPlantData() {
//     const [isLoading, setLoading] = useState(true);
//     const [plantObjs, setPlantObjects] = useState<PlantObject[]>([])
//     useEffect(() => {
//         // axios.get(`https://perenual.com/api/species-list?key=${apiKey}&page=1`) 
//         // .then( async response => {
//             // // console.log(response);
//             // const plantResponse = response.data.data.map((plant: any)=> {
//                 //     // console.log('heere! 25')
//                 //     return {
//                     //     id: plant.id,
//                     //     common_name: plant.common_name,
//                     //     scientific_name: plant.scientific_name[0],
//                     //     default_image: plant.default_image ? plant.default_image.original_url : no_img,
                    
//                     //     }
//                     // });
//                     // //console.log(plantResponse)
//         // setPlantObjects(plantResponse);
//         // setLoading(false);
//         // })
//         // .catch(() => {
//         //     console.log('you messed up')
//         // });

//         // Uncomment above and delte below! Local JSON is just for developing UI without burning through API calls
//         const plantResponse = page1.map((plant: any) => {
//             return {
//                 id: plant.id,
//                 common_name: plant.common_name,
//                 scientific_name: plant.scientific_name[0],
//                 cycle: plant.cycle ? plant.cycle : 'no data',
//                 watering: plant.watering ? plant.watering : 'no data',
//                 default_image: plant.default_image ? plant.default_image.original_url : no_img,
//             }
//         });
//         setPlantObjects(plantResponse);
//         setLoading(false);
//         // End dev test code
//     }, []);
//     return plantObjs;
// }
// function GetTestPlantData2() {
//     const [isLoading, setLoading] = useState(true);
//     const [plantObjs, setPlantObjects] = useState<PlantObject[]>([]);
//     // const [reminderObjs, setReminderObjects] = useState<ReminderObject[]>([])

//     useEffect(() => {
//         // Simulating an asynchronous operation (loading from JSON file)
//         const fetchData = async () => {
//             try {
//                 // const response = await fetch('../dev/page1.json');
//                 // const data = await response.json();
//                 const data = page1;

//                 let plantResponse:Array<PlantObject> = data.map(plant => ({
//                     id: plant.id,
//                     common_name: plant.common_name,
//                     scientific_name: plant.scientific_name[0],
//                     cycle: plant.cycle ? plant.cycle : 'no data',
//                     watering: plant.watering ? plant.watering : 'no data',
//                     default_image: plant.default_image ? plant.default_image.original_url : no_img,
//                 }));
                
//                 setPlantObjects(plantResponse);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     return plantObjs;
// }

// function GetTestReminderData(plants) {
//     const reminders:Array<ReminderObject> = Array<ReminderObject>(plants.length);
//     for(let i = 0; i < plants.length; ++i) {
//         let freq = 0;
//         switch (plants[i].watering.toLowerCase()) {
//             case 'frequent':
//                 freq = 2;
//                 break;
//             case 'average':
//                 freq = 7;
//                 break;
//             case 'minimum':
//                 freq = 12;
//                 break;
//             case 'none':
//                 freq = 0;
//                 break;
//             default:
//                 freq = 0;
//                 break;
//         }
//         let reminder: ReminderObject = {
//             id: plants[i].id,
//             plant: plants[i],
//             date: new Date('2023-11-29T03:24:00'),
//             frequency: freq
//         };
//         reminders[i] = reminder;        
//     }
//     return reminders;
// }


function GetUserData() {
    const [isLoading, setLoading] = useState(true);
    const [userObjs, setUserObjs] = useState<UserObject[]>([]);
    const { userId} = useParams();

    useEffect(() => {
        // Simulating an asynchronous operation (loading from JSON file)
        const fetchData = async () => {
            try {

                const data = test_users;
                // console.log((data));
                let userResponse:Array<UserObject> = data.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    picture_path: user.picture_path ? user.picture_path : no_img,
                    plants: GetTestPlantData3(user.plants),
                    reminders: GetTestReminderData3(user.reminders)
                }));
                
                setUserObjs(userResponse);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='Dashboard'>
            {/* <p>{`userId: ${userId}`}</p> */}
            <div className='Dashboard-top-half'>
                <MyProfile user={userObjs[0]}/>
                <AddPlants />
            </div>
            <div className='Dashboard-bottom-half'>
                <Reminders user={userObjs[0]}/>
                <MyPlants user={userObjs[0]}/>
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
        <div><GetUserData /></div>
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
                    alt={'Profile Picutre'}
                />
            </div>
            {/* -------------name, email, profile pic------------- */}
            <div className="profile-info">
                <span className='profile-header'>My Profile </span>
                <ul className="profile-info-data">
                    <li>{user.name}</li>
                    <li>{user.email}</li>
                </ul>
            </div>
            <div className='profile-management'>
                <button className='buttons'>Edit Profile</button>
                <button className='buttons' onClick={logout}>Log Out</button>
            </div>
        </div>
    );
}


function MyPlants(props: {user:UserObject}) {
    const user = props.user;
    const [viewMode, setViewMode] = useState('list');

    return (
        <div className='MyPlants-container'>
            <div className="MyPlants-header">
                {/* filter,search,sort,delete buttons implemented using api user endpoints */}
                {/* -------------my plants filtering/searching/sorting------------- */}
                <span className='MyPlants-title'>My Plants</span>
                <div className='view-toggle'>
                    <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                </div>
                <button className='filter-button'>
                    <img
                        className='button-icon'
                        src= '../logo192.png'
                        alt='filter icon'
                    />
                    <label>Filter</label>
                </button>
                <div className='search-bar'>
                    <img
                        className='button-icon'
                        src= '../logo192.png'
                        alt='search icon'
                    />
                    <form className="search-bar-textbox">
                        <input
                        type="search"
                        id="query"
                        name='q'
                        placeholder="Search..."
                        // onChange={(event) => setKeyword(event.target.value)}
                        />
                    </form>
                </div>
            </div>
            {/* <MyPlantsListView my_plants={user.plants}/> */}
            {/* <MyPlantsGalleryView my_plants={user.plants}/> */}
            
            {viewMode === 'list' ? (
            <MyPlantsListView my_plants={user.plants} />
            ) : (
            <MyPlantsGalleryView my_plants={user.plants} />
            )}
        </div>
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

function MyPlantsListView(props: {my_plants:Array<PlantObject>}) {
    const my_plants = props.my_plants;
    const {userId} = useParams();
    return (
        <div className="plant-list">
            {/* -------------list view------------- */}
            <div className="plant-list-header">
                <span className="label-picture">Picture</span>
                <span className="label-name">Name</span>
                <span className="label-cycle">Cycle</span>
                <span className="label-watering">Watering</span>
            </div>
            {my_plants.map(plant => (
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
            ))}
    </div>
    );
}

function MyPlantsGalleryView(props: {my_plants:Array<PlantObject>}) {
    const my_plants = props.my_plants;
    return (
        <div>
            <div className='gallery-filters'>
                <button type="button" className='gallery-filter-btn'>Annuals</button>
                <button type="button" className='gallery-filter-btn'>Perennials</button>
                <button type="button" className='gallery-filter-btn'>Biennials</button>
                <button type="button" className='gallery-filter-btn'>Vegetables</button>
                <button type="button" className='gallery-filter-btn'>Flowers</button>
                <button type="button" className='gallery-filter-btn'>Trees</button>
            </div>
            <ul className='masonry'>
                {my_plants.map((p, index) => {
                    return <li key={index}><GalleryListItem plant={p}/></li>
                })}
            </ul>
        </div>
    )
}
function GalleryListItem(props: {plant : PlantObject}) {
    const plant = props.plant
    const { userId } = useParams();
    return (
        <Link to={`/user/${userId}/detail/${plant.id}`}>
            <div className='plant-card'>
                <div className='plant-des'>
                    <h3 className='plant-name'>{`#${plant.id}: ${plant.common_name}`}</h3>
                    <p className='plant-species'><i>{plant.scientific_name}</i></p>
                </div>
                <img src={plant.default_image} alt={plant.common_name}/>
            </div>
        </Link>
    )
}

function Reminders(props: {user:UserObject}) {
    const user = props.user;
    const currentDate = new Date();
    return (
        <div className='Reminders-container'>
            <div className='Reminders-header'>
                <span className='Reminders-header-title'>
                    {`Reminders - ${currentDate.toLocaleDateString('en-US')}`}
                </span>
                <img
                    className='button-icon'
                    src='../logo192.png'
                    alt='reminders icon'
                />                
            </div>

            <RemindersListView reminders={user.reminders} />
        </div>
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
            reminderMessages.push(`Today's the day to water your ${reminder.plant.common_name} plants!`);
        }
    });
    
    if (reminderMessages.length === 0) {
        reminderMessages = ['No reminders for today.'];
    }

    return (
        <div className="reminder-list">
            {reminderMessages.map(reminderMessage => (
                <div className='list-row' key={reminderMessage}>
                    <span className='reminder-text'>{reminderMessage}</span>
                </div>
            ))}
        </div>
    );
}


function AddPlants() {
    return(
        <div className='AddPlants-container'>
            -------------add plants-------------
            <Link to={`/gallery`}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Morbi facilisis neque quis neque convallis, a consequat lectus ultricies. 
                    Sed ornare porta nulla, nec aliquam lorem congue quis. 
                    Pellentesque quis luctus massa, non finibus mi. Nam ac ultricies magna. 
                    Mauris lobortis faucibus odio, ut tincidunt ante semper sed. 
                    Nullam vel nibh eu orci bibendum pulvinar.
                </p>
            </Link>
        </div>
    );
}
