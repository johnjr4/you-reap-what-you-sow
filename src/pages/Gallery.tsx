import React, {useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import no_img from '../images/no_img.jpg';
import './Gallery.scss';
import page1 from '../dev/page1.json'
import PlantObject from '../types/PlantObject';

const apiKey = "sk-FDOp656a72748c8563227"; // PUT YOUR KEY HERE

function Gallery() {
    const [isLoading, setLoading] = useState(true);
    const [plantObjs, setPlantObjects] = useState<PlantObject[]>([])
    const { userId} = useParams();
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
            }
        });
        setPlantObjects(plantResponse);
        setLoading(false);
        // End dev test code
    }, []);

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
                    <button type="button" className='gallery-filter-btn'>Annuals</button>
                    <button type="button" className='gallery-filter-btn'>Perennials</button>
                    <button type="button" className='gallery-filter-btn'>Biennials</button>
                    <button type="button" className='gallery-filter-btn'>Vegetables</button>
                    <button type="button" className='gallery-filter-btn'>Flowers</button>
                    <button type="button" className='gallery-filter-btn'>Trees</button>
                </div>
                <ul className='masonry'>
                    {plantObjs.map((p) => {
                        return <li key={p.id}><ListItem plant={p} userId={userId}/></li>
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