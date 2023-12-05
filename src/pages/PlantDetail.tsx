import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import page1 from '../dev/page1.json';
import no_img from '../images/no_img.jpg';

type PlantObject = {
  id: number;
  common_name: string;
  scientific_name: string;
  default_image: any;
};

const defaultPlant = {
  id: -1,
  common_name: 'Not a real plant',
  scientific_name: 'You screwed up',
  default_image: no_img,
};

function PlantDetail() {
  const { id } = useParams();
  const [plantObj, setPlantObj] = useState<PlantObject>(defaultPlant);
  const [isLoading, setLoading] = useState(true);
  const [isFailed, setFailed] = useState(false);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/plants/${id}`);
        if (!response.ok) {
          throw new Error('Plant not found');
        }
        const plantData = await response.json();
        setPlantObj({
          id: plantData.id,
          common_name: plantData.common_name,
          scientific_name: plantData.scientific_name,
          default_image: plantData.default_image ? plantData.default_image.original_url : no_img,
        });
      } catch (error) {
        console.error('Error fetching plant details:', error.message);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isFailed) {
    return <div>Plant not found :(</div>;
  }

  return (
    <div>
      <h1>
        Plant #{id}: {plantObj.common_name}
      </h1>
      <img src={plantObj.default_image} alt={plantObj.common_name} />
    </div>
  );
}

export default PlantDetail