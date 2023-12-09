import PlantObject from './PlantObject.tsx'
import ReminderObject from './ReminderObject.tsx'

type UserObject = {
    id: any,
    name: string,
    email: string,
    picture_path: any,
    plants: Array<number>,
    reminders: Array<ReminderObject>
}
  export default UserObject;
