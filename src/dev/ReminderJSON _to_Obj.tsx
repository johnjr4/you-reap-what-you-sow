import ReminderObject from "../types/ReminderObject";
function ReminderJSON_to_Obj(data) {
    let reminderResponse:Array<ReminderObject> = data.map(reminder => ({
        id: reminder.id,
        plant_name: reminder.plant_name,
        date: reminder.date,
        frequency: reminder.frequency
    }));

    return reminderResponse;
}
export default ReminderJSON_to_Obj;