import PlantObject from './PlantObject.tsx'
type ReminderObject = {
    id: number,
    plant: PlantObject,
    date: Date,
    frequency: number // days
}
export default ReminderObject;