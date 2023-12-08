import PlantObject from "../types/PlantObject.tsx";
import React, { useState, useEffect } from 'react';
import no_img from "../images/no_img.jpg";

// For JSON page1
// function PlantIdArr_to_PlantObjArr(props: {plantIds:Array<number>, data:any}) {
//     const plantIds = props.plantIds;
//     const data = props.data;
//     const [ plantObjArr, setPlantObjArr ] = useState<PlantObject[]>([]);
//     const [ plantObj, setPlantObj] = useState<PlantObject>();
//     const [isLoading, setLoading] = useState(true);
//     const [isFailed, setFailed] = useState(false);
//     plantIds.forEach(plantId => {
//         let plantData = data.find(plant => plant.id === Number(plantId));
//         setLoading(false);
//         if (plantData) {
//             setPlantObj({
//                 id: plantData.id,
//                 common_name: plantData.common_name,
//                 scientific_name: plantData.scientific_name[0],
//                 cycle: plantData.cycle,
//                 watering: plantData.watering,
//                 default_image: plantData.default_image ? plantData.default_image.original_url : no_img,
//             });
//             setPlantObjArr([...plantObjArr, plantObj]);
//         } else {
//             setFailed(true);
//         }        
//     });

//     return plantObjArr;
// }
// export default PlantIdArr_to_PlantObjArr;
function PlantIdArr_to_PlantObjArr(props: { plantIds: Array<number>; data: any }) {
    const plantIds = props.plantIds;
    const data = props.data;
    const [plantObjArr, setPlantObjArr] = useState<PlantObject[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isFailed, setFailed] = useState(false);
  
    useEffect(() => {
      const fetchPlantData = async () => {
        try {
          let fetchedPlantObjArr:PlantObject[] = [];
          for (const plantId of plantIds) {
            let plantData = data.find((plant) => plant.id === Number(plantId));
            if (plantData) {
              fetchedPlantObjArr.push({
                id: plantData.id,
                common_name: plantData.common_name,
                scientific_name: plantData.scientific_name[0],
                cycle: plantData.cycle,
                watering: plantData.watering,
                default_image: plantData.default_image
                  ? plantData.default_image.regular_url
                  : no_img,
              });
            } else {
              setFailed(true);
            }
          }
          setPlantObjArr(fetchedPlantObjArr);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching plant data:', error);
          setLoading(false);
          setFailed(true);
        }
      };
  
      fetchPlantData();
    }, [plantIds, data]);
  
    return plantObjArr;
  }
  
  export default PlantIdArr_to_PlantObjArr;