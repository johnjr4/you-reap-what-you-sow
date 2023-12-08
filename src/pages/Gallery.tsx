import React, {useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import no_img from '../images/no_img.jpg';
import './Gallery.scss';
import page1 from '../dev/page1.json'
import PlantObject from '../types/PlantObject';

const apiKey = "sk-FDOp656a72748c8563227"; // PUT YOUR KEY HERE

function plantFilter(idx, plant) {
    console.log(`Checking ${plant} against filter ${idx}`);
    console.log(plant);
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

function Gallery() {
    const [isLoading, setLoading] = useState(true);
    const [plantObjs, setPlantObjects] = useState<PlantObject[]>([])
    const [filterNum, setFilterNum] = useState(0);
    const { userId } = useParams();

    const filters = ['Annuals', 'Perennials', 'Biennials', 'Vegetables', 'Trees', 'Flowers']
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
        setLoading(false);
        // End dev test code
    }, []);

    function selectFilter(idx) {
        if (filterNum === idx) {
            setFilterNum(0); // Turn filters off
        } else {
            setFilterNum(idx);
        }
    }

    if (isLoading) {
        return (
            <div>
                Gallery layout
            </div>
        );
    } else {
        return (
            <div>
                <h1>
                    Plant Gallery
                </h1>
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
                    {plantObjs.map((p: PlantObject) => {
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
                <img src={plant.default_image} alt={plant.common_name}/>
            </div>
        </Link>
    )
}

export default Gallery;