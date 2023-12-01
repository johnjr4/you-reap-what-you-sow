import React from 'react';
import PlantObject from '../types/PlantObject.tsx';
import UserObject from '../types/UserObject.tsx';
import ReminderObject from '../types/ReminderObject.tsx';

export default function Dashboard() {
    // test
    let plant1: PlantObject = {
        id: 1,
        common_name: 'Tulip',
        scientific_name: 'flowerus tulipicus',
        cycle: 'Perennial',
        watering: 'Frequent',
        default_image: '../logo192.png'
    };
    let plant2: PlantObject = {
        id: 2,
        common_name: 'Sunflower',
        scientific_name: 'flowerus solaris',
        cycle: 'Annual',
        watering: 'Average',
        default_image: '../logo192.png'
    };
    let plant3: PlantObject = {
        id: 3,
        common_name: 'Peony',
        scientific_name: 'flowerus peonesimus',
        cycle: 'Perennial',
        watering: 'Frequent',
        default_image: '../logo192.png'
    };
    let plant4: PlantObject = {
        id: 4,
        common_name: 'Dahlia',
        scientific_name: 'flowerus dalias',
        cycle: 'Biennial',
        watering: 'Frequent',
        default_image: '../logo192.png'
    };
    let test_my_plants:Array<PlantObject> = [plant1, plant2, plant3, plant4];
    let test_user: UserObject = {
        id: 1,
        name: 'Nolan Nettleman',
        email: 'nnettleman@plantmail.com',
        picture_path: '../logo192.png',
        plants: test_my_plants,
        reminders: []
    };
    return (
        <div className='Dashboard'>
            <div className='Dashboard-top-half'>
                <MyProfile user={test_user}/>
            </div>
            <div className='Dashboard-bottom-half'>
                <MyPlants user={test_user}/>
                <AddPlants />
            </div>
        </div>
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
                <button className='buttons'>Log Out</button>
            </div>
        </div>
    );
}


function MyPlants(props: {user:UserObject}) {
    const user = props.user;
    return (
        <div className='MyPlants-container'>
            <div className="MyPlants-header">
                {/* filter,search,sort,delete buttons implemented using api user endpoints */}
                {/* -------------my plants filtering/searching/sorting------------- */}
                <span className='MyPlants-title'>My Plants</span>
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
            <MyPlantsListView my_plants={user.plants}/>
        </div>
    );
}
function MyPlantsListView(props: {my_plants:Array<PlantObject>}) {
    const my_plants = props.my_plants;
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
                <div className="plant-list-row">
                    <img
                        className='plant-pic'
                        src={plant.default_image}
                        alt={`${plant.common_name}`}
                    />
                    <span className="common-name">{plant.common_name}</span>
                    <span className="cycle">{plant.cycle}</span>
                    <span className="watering">{plant.watering}</span>

                </div>
            ))}
    </div>
    );
}

function Reminders(props: {user:UserObject}) {
    return <div className='Reminders-container'>

    </div>
}
function RemindersListView(props: {reminders:Array<ReminderObject>}) {
    const reminders = props.reminders;
    return (
        <div className="reminder-list">
            {/* -------------list view------------- */}
            {/* <div className="reminder-list-header">
                <span className="label-picture">Picture</span>
                <span className="label-name">Name</span>
                <span className="label-cycle">Cycle</span>
                <span className="label-watering">Watering</span>
            </div> */}
            {reminders.map(plant => (
                <div className="plant-list-row">
                    <img
                        className='plant-pic'
                        src={plant.default_image}
                        alt={`${plant.common_name}`}
                    />
                    <span className="common-name">{plant.common_name}</span>
                    <span className="cycle">{plant.cycle}</span>
                    <span className="watering">{plant.watering}</span>

                </div>
            ))}
    </div>
    );
}

function AddPlants() {
    return(
        <div className='AddPlants-container'>
            -------------add plants-------------
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Morbi facilisis neque quis neque convallis, a consequat lectus ultricies. 
                Sed ornare porta nulla, nec aliquam lorem congue quis. 
                Pellentesque quis luctus massa, non finibus mi. Nam ac ultricies magna. 
                Mauris lobortis faucibus odio, ut tincidunt ante semper sed. 
                Nullam vel nibh eu orci bibendum pulvinar.
            </p>
        </div>
    );
}
