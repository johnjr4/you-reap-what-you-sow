import ReminderObject from '../types/ReminderObject.tsx';

function GetTestReminderData3(data) {
    // const [isLoading, setLoading] = useState(true);
    // const [reminderObjs, setReminderObjs] = useState<ReminderObject[]>([]);
    let reminderResponse:Array<ReminderObject> = data.map(reminder => ({
        id: reminder.id,
        plant: reminder.plant,
        date: reminder.date,
        frequency: reminder.frequency
    }));
    
    // setReminderObjs(reminderResponse);
    // setLoading(false);
    // useEffect(() => {
    //     // Simulating an asynchronous operation (loading from JSON file)
    //     const fetchData = async () => {
    //         try {


    //             let reminderResponse:Array<ReminderObject> = data.map(reminder => ({
    //                 id: reminder.id,
    //                 plant: reminder.plant,
    //                 date: reminder.date,
    //                 frequency: reminder.frequency
    //             }));
                
    //             setReminderObjs(reminderResponse);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // });

    return reminderResponse;
}
export default GetTestReminderData3;