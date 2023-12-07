import PlantObject from '../types/PlantObject.tsx';

function GetTestPlantData3(data) {
    // const [isLoading, setLoading] = useState(true);
    // const [plantObjs, setPlantObjects] = useState<PlantObject[]>([]);
    let plantResponse:Array<PlantObject> = data.map(plant => ({
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name[0],
        cycle: plant.cycle ? plant.cycle : 'no data',
        watering: plant.watering ? plant.watering : 'no data',
        default_image: plant.default_image ? plant.default_image.original_url : no_img,
    }));
    
    // setPlantObjects(plantResponse);
    // setLoading(false);
    // useEffect(() => {
    //     // Simulating an asynchronous operation (loading from JSON file)
    //     const fetchData = async () => {
    //         try {
    //             // const response = await fetch('../dev/page1.json');
    //             // const data = await response.json();

    //             let plantResponse:Array<PlantObject> = data.map(plant => ({
    //                 id: plant.id,
    //                 common_name: plant.common_name,
    //                 scientific_name: plant.scientific_name[0],
    //                 cycle: plant.cycle ? plant.cycle : 'no data',
    //                 watering: plant.watering ? plant.watering : 'no data',
    //                 default_image: plant.default_image ? plant.default_image.original_url : no_img,
    //             }));
                
    //             setPlantObjects(plantResponse);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []);

    return plantResponse;
}
export default GetTestPlantData3;