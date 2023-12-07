import PlantObject from './PlantObject.tsx'
type ReminderObject = {
    id: any,
    plant: PlantObject,
    date: Date,
    frequency: number // days
}
export default ReminderObject;