import React, {useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import no_img from '../images/no_img_square.jpg';
import './Gallery.scss';
import PlantObject from '../types/PlantObject';
import Fuse from 'fuse.js';
import PlantDetailObject from '../types/PlantDetailObject';

function plantFilter(idx, plant) {
    switch (idx) {
        case 1:
            console.log("filtering annuals");
            return plant.cycle === "Annual"
        case 2:
            console.log("filtering perennials");
            console.log(plant);
            return plant.cycle === "Perennial"
        case 3:
            console.log("filtering biennials");
            return plant.cycle === "Biennial"
        case 4:
            console.log("filtering trees");
            return plant.type === "tree";
        case 5:
            console.log("filtering flowers");
            return plant.flowers;
        default:
            return true; // 0
    }
}

function Gallery() {
    const [isLoading, setLoading] = useState(true);
    const [plantObjs, setPlantObjects] = useState<PlantDetailObject[]>([])
    const [filterNum, setFilterNum] = useState(0);
    const [query, setQuery] = useState("");
    const { userId } = useParams();

    const filters = ['Annuals', 'Perennials', 'Biennials', 'Trees', 'Flowers']
    useEffect(() => {
        axios.get(`http://localhost:4001/api/plants?where={"common_name":{"$regex":"${query}","$options":"i"}}&sort={"id":1}&limit=100`) 
        .then( async response => {
            setPlantObjects(response.data.data);
            setLoading(false);
        })
        .catch(() => {
            console.log('you messed up')
        });
    }, [query]);

    function selectFilter(idx) {
        if (filterNum === idx) {
            setFilterNum(0); // Turn filters off
        } else {
            setFilterNum(idx);
        }
    }

    if (isLoading) {
        return (
            <h1>
                Loading...
            </h1>
        );
    } else {
        return (
            <div>
                <h1>
                    Plant Gallery
                </h1>
                <input 
                    type='text' 
                    id='search-bar'
                    placeholder='Search for a plant...'
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className='gallery-filters'>
                    {filters.map((filter, idx) => {
                        return <button
                            style={filterNum === idx + 1 ? {"backgroundColor": "lightgreen"} : {}}
                            onClick={() => selectFilter(idx + 1)}
                            className='gallery-filter-btn'
                        >{filter}</button>
                    })}
                </div>
                <ul className='masonry'>
                    {plantObjs.map((p:PlantObject) => {
                        if (plantFilter(filterNum, p)) {
                            return <li key={p.id}><ListItem plant={p} userId={userId}/></li>
                        } else {
                            return null;
                        }
                    })}
                </ul>
            </div>
        )
    }
}

function ListItem(props: {plant : PlantObject, userId : string}) {
    const plant = props.plant;
    const userId = props.userId;
    return (
        <Link to={`/user/${userId}/detail/${plant.id}`}>
            <div className='plant-card'>
                <div className='plant-des'>
                    <h3 className='plant-name'>{`#${plant.id}: ${plant.common_name}`}</h3>
                    <p className='plant-species'><i>{plant.scientific_name}</i></p>
                </div>
                <img src={plant.default_image ? plant.default_image.original_url : no_img} alt={plant.common_name}/>
            </div>
        </Link>
    )
}

export default Gallery;