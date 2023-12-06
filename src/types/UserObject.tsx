import PlantObject from './PlantObject.tsx'
import ReminderObject from './ReminderObject.tsx'

type UserObject = {
    id: number,
    name: string,
    email: string,
    picture_path: any,
    plants: Array<PlantObject>,
    reminders: Array<ReminderObject>
}
  export default UserObject;
