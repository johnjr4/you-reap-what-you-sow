import React, {useEffect, useState} from 'react';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';
import DetailView from './components/DetailView';
import axios from 'axios';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.scss';


type PokemonObject = {
  species: string;
  img: string;
  id: number;
  type0: string;
  type1: string;
  attack: number;
}

function App() {
  const [isLoading, setLoading] = useState(true);

  const [pokemonObjs, setPokemonObjects] = useState<PokemonObject[]>([])
  
  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=649`)
    .then( async response => {
        const pokePromise = response.data.results.map((mon : {name: string}) =>
     
          axios.get(`https://pokeapi.co/api/v2/pokemon/${mon.name}`).then( res => {
            return {
              species: res.data.species.name,
              img: res.data.sprites.other.home.front_default,
              id: res.data.id,
              type0: res.data.types[0].type.name,
              type1: res.data.types[1]? res.data.types[1].type.name : "",
              attack: res.data.stats[1].base_stat,
            }
        })
        
      );
        Promise.all(pokePromise).then(pokeData => {
          const pokemonInfo = pokeData.map((data : PokemonObject) =>{ return data});
          setPokemonObjects(pokemonInfo );
          setLoading(false);
        });
    })
      .catch((error) => {
          console.error(error);
      });
  }, []);
  

  if(isLoading) {
    return (<div className="App"> 
      <h1>Pokemon Gen 1-5</h1>
      <p>Loading...</p>
    </div>)
  }
  return (
    

    <div className="App">
      <h1>Pokemon Gen 1-5</h1>


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
          <Route path="/mp2/" element={<ListView pokemon={pokemonObjs}/>}/>
          <Route path="/mp2/gallery" element={<GalleryView pokemon={pokemonObjs}/>}/>
            

            <Route path="/mp2/details/:id" element={<DetailView pokemon={pokemonObjs}/>}></Route>

        </Routes>
      </BrowserRouter>
      
      {/* <DetailView pokemon={pokemonObjs}/> */}
      
    </div>
    
  );
}

export default App;

