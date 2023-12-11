import React, { useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PlantObject from "../types/PlantObject.tsx";
import UserObject from "../types/UserObject.tsx";
import ReminderObject from "../types/ReminderObject.tsx";
import updated_users from "../dev/updated_users.json";
import { auth, db, logout } from "../firebase";
import { User } from "firebase/auth";
import Fuse from "fuse.js";
import { query, collection, getDocs, where } from "firebase/firestore";


function GetUserData2(props: { data: JSON; user: User }) {
  const [isLoading, setLoading] = useState(true);
  const [userObj, setUserObj] = useState<UserObject>();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user's name and email from firebase DB using the uid=userId from url
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        const usernameFB = data.name;
        const emailFB = data.email;
        console.log(`Firebase info for user id ${userId}: ${usernameFB}, ${emailFB}`);
        if (usernameFB && emailFB) {
          // PUT this user into the mongoDB since the post request in the register page can only add name and email. this adds the firebase ID to the data
          // If the user has already logged in once before, this will error and be caught.
          try {
            const assign_FB_id_to_mongoDB = await axios.put(`http://localhost:4001/api/users/123`, {
              name: usernameFB,
              email: emailFB,
              id: userId
            },
            {
              headers: {
                'purpose': 'Initial put'
              }
            });
            // console.log(assign_FB_id_to_mongoDB);
          } catch(error) {
            console.log(`Error in put in dashboard: ${error.message}`);
          }
        }
        // actually GET data from axios
        console.log('attempting fetch from mongo users endpt');
        const userResponse = await axios.get(`http://localhost:4001/api/users/${userId}`);
        if (userResponse) {
          setLoading(false);
          console.log(userResponse.data.data);
          const userData = userResponse.data.data;
          setUserObj({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            picture_path: userData.picture_path ? userData.picture_path : '/default_pfp.svg',
            plants: userData.plants,
            // reminders: userData.reminders,
            reminders: [] // temporary 
          });
        }
        console.log('end get user data from db: success!');
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [props.data, userId]);

  if (isLoading) {
    return (
    <div className="Dashboard">
      <h1>Loading...</h1>
    </div>
    );
  }

  return (
    <div className="Dashboard">
      <div className="Dashboard-top-half">
        <MyProfile user={props.user} userObject={userObj ? userObj : ({} as UserObject)} />
        <Reminders user={userObj ? userObj : ({} as UserObject)} />
      </div>
      <div className="Dashboard-bottom-half">
        <MyPlants user={userObj ? userObj : ({} as UserObject)} />
        <AddPlants userObject={userObj} setUserObject={setUserObj} />
      </div>
    </div>
  );
}
export default function Dashboard(props: { user: User | undefined | null }) {
  console.log('in dashboard');
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
    <div>
      <GetUserData2
        data={updated_users}
        user={props.user ? props.user : ({} as User)}
      />
    </div>
  );
}

function MyProfile(props: { user: User, userObject:UserObject}) {
  const user = props.user;
  const userObj = props.userObject;
  return (
    <div className="MyProfile-container">
      <div className="profile-pic">
        <img
          className="profile-pic"
          src={userObj.picture_path ? userObj.picture_path : '/default_pfp.svg'}
          alt={"Profile"}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="profile-info">
        <span className="profile-header">My Profile </span>
        <div className="profile-info-data">
          <div className="profile-info-name">{userObj.name}</div>
          <div className="profile-info-email">{user.email}</div>
        </div>
      </div>
      {/* <div className='profile-management'>
                <button className='buttons'>Edit Profile</button>
                <button className='buttons' onClick={logout}>Log Out</button>
            </div> */}
    </div>
  );
}

function MyPlants(props: { user: UserObject}) {
  const user = props.user;

  const [isLoading, setLoading] = useState(true);
  const [plantObjs, setPlantObjects] = useState<PlantObject[]>([]);
  const [filterNum, setFilterNum] = useState(0);
  const [viewMode, setViewMode] = useState("list");
  const filters = [
    "Annuals",
    "Perennials",
    "Biennials",
    "Trees",
    "Flowers",
  ];

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        let fetchedPlantObjArr: PlantObject[] = [];
        const query = `http://localhost:4001/api/plants?where={"id":{"$in":[${user.plants.toString()}]}}&sort={"id":1}`;
        // console.log(query);
        const plantResponse = await axios.get(query);
        const plantDataArr = plantResponse.data.data;
        // console.log(plantDataArr);
        plantDataArr.forEach(plantData => {
          fetchedPlantObjArr.push({
            id: plantData.id,
            common_name: plantData.common_name,
            scientific_name: plantData.scientific_name[0],
            cycle: plantData.cycle,
            watering: plantData.watering,
            default_image: plantData.default_image ? (plantData.default_image.regular_url ? plantData.default_image.regular_url : '/no_img_square.jpg') : '/no_img_square.jpg',            
          });
        });
        setPlantObjects(fetchedPlantObjArr);
        console.log(`HELLO ${user.plants}`);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plant data:", error);
        setLoading(false);
      }
    };
    fetchPlantData();
  }, [user]);

  function selectFilter(idx) {
    if (filterNum === idx) {
      setFilterNum(0); // Turn filters off
    } else {
      setFilterNum(idx);
    }
  }
  if (isLoading) {
    return (
    <div className="MyPlants-container">
      <h2>Loading your plants...</h2>
    </div>);
  } else {
    return (
      <div className="MyPlants-container">
        <span className="MyPlants-title">My Plants</span>
        <div className="MyPlants-header">
          <div className="view-toggle">
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
          <div className="MyPlants-gallery-filters">
            {filters.map((filter, idx) => {
              return (
                <button
                  style={
                    filterNum === idx + 1
                      ? { backgroundColor: "lightgreen" }
                      : {}
                  }
                  onClick={() => selectFilter(idx + 1)}
                  className="MyPlants-gallery-filter-btn"
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
        {viewMode === "list" ? (
          <div className="plant-list">
            <div className="plant-list-header">
              <span className="label-picture">Picture</span>
              <span className="label-name">Name</span>
              <span className="label-cycle">Cycle</span>
              <span className="label-watering">Watering</span>
            </div>
            {plantObjs.map((plant: PlantObject) => {
              if (plantFilter(filterNum, plant)) {
                return <ListItem plant={plant} />;
              } else {
                return null;
              }
            })}
          </div>
        ) : (
          <ul className="MyPlants-masonry">
            {plantObjs.map((p: PlantObject) => {
              if (plantFilter(filterNum, p)) {
                return (
                  <li key={p.id}>
                    <GalleryListItem plant={p} />
                  </li>
                );
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
function ListItem(props: { plant: PlantObject }) {
  const plant = props.plant;
  const { userId } = useParams();
  return (
    <Link
      to={`/user/${userId}/detail/${plant.id}`}
      className="list-link"
      key={plant.id}
    >
      <div className="list-row">
        <img
          className="plant-pic"
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
function GalleryListItem(props: { plant: PlantObject }) {
  const plant = props.plant;
  const { userId } = useParams();
  return (
    <Link to={`/user/${userId}/detail/${plant.id}`}>
      <div className="MyPlants-plant-card">
        <div className="MyPlants-plant-des">
          <h3 className="MyPlants-plant-name">{`#${plant.id}: ${plant.common_name}`}</h3>
          <p className="MyPlants-plant-species">
            <i>{plant.scientific_name}</i>
          </p>
        </div>
        <img src={plant.default_image} alt={plant.common_name} />
      </div>
    </Link>
  );
}

function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="toggle-switch">
      <label>
        <input
          type="radio"
          value="list"
          checked={viewMode === "list"}
          onChange={() => setViewMode("list")}
        />
        List
      </label>
      <label>
        <input
          type="radio"
          value="gallery"
          checked={viewMode === "gallery"}
          onChange={() => setViewMode("gallery")}
        />
        Gallery
      </label>
    </div>
  );
}

function plantFilter(idx, plant) {
  switch (idx) {
    case 1:
      return plant.cycle === "Annual";
    case 2:
      return plant.cycle === "Perennial";
    case 3:
      return plant.cycle === "Biennial";
    case 4:
      return plant.type === "trees";
    case 5:
      return plant.flowers;
    default:
      return true; // 0
  }
}

function Reminders(props: { user: UserObject }) {
  const user = props.user;
  const currentDate = new Date();
  return (
    <div className="Reminders-container">
      <div className="Reminders-header">
        <span className="Reminders-header-title">
          {`Reminders - ${currentDate.toLocaleDateString("en-US")}`}
        </span>
        <img
          className="button-icon"
          src="../logo192.png"
          alt="reminders icon"
        />
      </div>

      <RemindersListView reminders={user.reminders} />
    </div>
  );
}
function RemindersListView(props: { reminders: Array<ReminderObject> }) {
  const reminders = props.reminders;
  const currentDate = new Date();
  let reminderMessages: Array<string> = [];
  if (reminders) {
    reminders.forEach((reminder) => {
      const dateCreated = new Date(reminder.date);
      const timeDifference = currentDate.getTime() - dateCreated.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
      if (
        reminder.frequency !== 0 &&
        daysDifference % reminder.frequency === 0
      ) {
        reminderMessages.push(
          `Today's the day to water your ${reminder.plant_name} plants!`
        );
      }
    });
  }

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

  const AddPlantToUser = async (plant) => {
    try {
      console.log(`attempting to post to http://localhost:4001/api/users/${userId}/${plant.id}`);
      const updateUsersResponse = await axios.post(`http://localhost:4001/api/users/${userId}/${plant.id}`, {
        headers: {
          'purpose': ''
        }
      });
      setUserObject({
        ...userObject,
        plants: [...userObject.plants, plant.id]
      });
      console.log(userObject);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        let fetchedPlantObjArr: PlantObject[] = [];
        // console.log(user.plants.toString());
        const query = `http://localhost:4001/api/plants`;
        // console.log(query);
        const plantResponse = await axios.get(query);
        const plantDataArr = plantResponse.data.data;
        // console.log(plantDataArr);
        await plantDataArr.forEach(plantData => {
          fetchedPlantObjArr.push({
            id: plantData.id,
            common_name: plantData.common_name,
            scientific_name: plantData.scientific_name[0],
            cycle: plantData.cycle,
            watering: plantData.watering,
            default_image: plantData.default_image ? plantData.default_image.regular_url : '/no_img_square.jpg',            
          });
        });
        await setPlantObjects(fetchedPlantObjArr);
        const fuse = new Fuse(plantObjs, {
            keys: ['common_name']
        })
        await setPlantFuse(fuse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plant data:", error);
        setLoading(false);
      }
    };
    fetchPlantData();
  });

  function isAdded(p) {
    return userObject.plants.find(o => Number(o) === Number(p.item.id)) !== undefined
  }
  
  if (isLoading) {
      return (
        <div className="AddPlants-container">
          <h2>Loading add plant menu...</h2>
        </div>
      );
  } else {
      return (
          <div className='AddPlants-container'>
              <span className='AddPlants-title'>Add Plants</span>
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
                                          onClick={() => AddPlantToUser(p.item)}
                                      >
                                        <img
                                          className='add-img'
                                          src={isAdded(p) ? 
                                            '/add_check.svg'
                                            :
                                            '/add_plus.svg'
                                          }/>
                                        <label>{p.item.common_name}</label>
                                      </button>
                                  </li>
                              );
                          })
                      ) : (
                          <div></div>
                      )}
                  </ul>
                </div>
                <div className='AddPlants-by-gallery'>
                    <Link to='gallery' className='AddPlants-link'>
                        <p>Or, add a plant from the gallery page.</p>
                    </Link>
                </div>
          </div>
      );
  }
}
