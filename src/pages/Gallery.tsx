import React, {useEffect, useState} from 'react';
import axios from 'axios';

type PlantObject = {
    id: Number,
    common_name: string,
    scientific_name: string,
    default_image: any,
  }

function Gallery() {
    const [isLoading, setLoading] = useState(true);
    const [plantObjs, setPlantObjects] = useState<PlantObject[]>([])
    useEffect(() => {
        axios.get(`https://perenual.com/api/species-list?key=sk-GjpM65690bcdbceaf3227page=1`) // PUT YOUR KEY HERE
        .then( async response => {
        //console.log(response);
        const plantResponse = response.data.data.map((plant: any)=> {
            // console.log('heere! 25')
            return {
            id: plant.id,
            common_name: plant.common_name,
            scientific_name: plant.scientific_name[0],
            default_image: plant.default_image ? plant.default_image.original_url : '',
        
            }
        });
        //console.log(plantResponse)
        setPlantObjects(plantResponse);
        setLoading(false);
        })
        .catch(() => {
            console.log('you messed up')
        });
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
                {plantObjs.map((p, index) => {
                    return <li key={index}><ListItem plant={p}></ListItem></li>
                })}
            </div>
        )
    }
}
function ListItem(props: {plant : PlantObject}) {
    const plant = props.plant
    return (
        <div>
                <h5>{plant.common_name}</h5>
                <h3> # {'' + plant.id}</h3>
                <p> {plant.scientific_name}</p>
                <p> {plant.default_image}</p>
                <img src={plant.default_image} alt={plant.common_name}>

                </img>
                {/* </Link> */}
            
        </div>

            
    )
}

export default Gallery;