import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import page1 from '../dev/page1.json';
import no_img from '../images/no_img.jpg';

type PlantObject = {
    id: Number,
    common_name: string,
    scientific_name: string,
    default_image: any,
}

const defaultPlant = {
    id: -1,
    common_name: "Not a real plant",
    scientific_name: "You screwed up",
    default_image: no_img
}

function PlantDetail() {
    const { id } = useParams();
    const [ plantObj, setPlantObj ] = useState<PlantObject>(defaultPlant);
    const [isLoading, setLoading] = useState(true);
    const [isFailed, setFailed] = useState(false);

    useEffect(() => {
        // TODO: Replace with API call
        let plantQuery = page1.find(plant => plant.id === Number(id));
        setLoading(false);
        if (plantQuery) {
            setPlantObj({
                id: plantQuery.id,
                common_name: plantQuery.common_name,
                scientific_name: plantQuery.scientific_name[0],
                default_image: plantQuery.default_image ? plantQuery.default_image.original_url : no_img,
            });
        } else {
            setFailed(true);
        }
    });

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (isFailed) {
        return (
            <div>
                Plant not found :(
            </div>
        )
    }

    return (
        <div>
            <h1>
                Plant #{id}: {plantObj.common_name}
            </h1>
            <img src={plantObj.default_image}/>
        </div>
    );
}

export default PlantDetail;