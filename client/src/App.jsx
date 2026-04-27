import  ClassroomList  from "./components/ClassroomList";
import Navbar from "./components/Navbar";
function APP(){
  return(
    <div>
      <Navbar></Navbar>
      <h1>מערכת הקצאת כיתות</h1>
      <ClassroomList></ClassroomList>
    </div>
  )
}
export default APP;