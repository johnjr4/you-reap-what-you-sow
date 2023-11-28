import React, {useEffect, useState} from 'react';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';
import DetailView from './components/DetailView';
import axios from 'axios';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.scss';


type PlantObject = {
  id: Number,
  common_name: String,
  scientific_name: String,
  default_image: any,
}

function App() {
  const [isLoading, setLoading] = useState(true);
  const [plantObjs, setPlantObjects] = useState<PlantObject[]>([])
  useEffect(() => {
    axios.get(`https://perenual.com/api/species-list?key=sk-aGCf655ebecfae54d3092&page=10`) // PUT YOUR KEY HERE
    .then( async response => {
      console.log(response);
      const plantResponse = response.data.data.map((plant: any)=> {
        // console.log('heere! 25')
        return {
          id: plant.id,
          common_name: plant.common_name,
          scientific_name: plant.scientific_name[0],
          default_image: plant.default_image ? plant.default_image.original_url : 'empty',
     
        }
      });
      console.log(plantResponse)
      setPlantObjects(plantResponse);
      setLoading(false);
    })
      .catch((error) => {
          console.log('you messed up')
          // console.error(error);
      });
  }, []);
  

  if(isLoading) {
    return (<div className="App"> 
      <h1>You Reap What You Sow</h1>
      <p>Loading...</p>
    </div>)
  }
  return (
    

    <div className="App">
      <h1>You Reap What You Sow</h1>


      <BrowserRouter>
      <div className="navbar">
        <nav>
          <ul>
            <li><Link to="/mp2/">List</Link></li>
            <li><Link to="/mp2/gallery">Gallery</Link></li>
          </ul>
        </nav>
      </div>

        <Routes>
          <Route path="/" element={<ListView plants={plantObjs}/>}/>
          {/* <Route path="/mp2/gallery" element={<GalleryView pokemon={plantObjs}/>}/>
            

            <Route path="/mp2/details/:id" element={<DetailView pokemon={plantObjs}/>}></Route> */}

        </Routes>
      </BrowserRouter>
      
      {/* <DetailView pokemon={pokemonObjs}/> */}
      
    </div>
    
  );
}

export default App;

