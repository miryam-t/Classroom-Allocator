import  ClassroomList  from "./components/ClassroomList";
import RoomManagement from "./components/RoomManagement";

function APP(){
  return(
    <div>
      <h1>מערכת הקצאת כיתות</h1>
      <ClassroomList></ClassroomList>
      <RoomManagement></RoomManagement>
    </div>
  )
}
export default APP;