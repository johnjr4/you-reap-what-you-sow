import PlantObject from './PlantObject.tsx'
type ReminderObject = {
    id: any,
    // plant: PlantObject,
    plant_name: string,
    date: Date,
    frequency: number // days
}
export default ReminderObject;