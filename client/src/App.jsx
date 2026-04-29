import  ClassroomList  from "./components/ClassroomList";
import Navbar from "./components/Navbar";
import AddCancellation from "./components/AddCancellation";
function APP(){
  return(
    <div>
      <Navbar></Navbar>
      <h1>מערכת הקצאת כיתות</h1>
      <ClassroomList></ClassroomList>
      {/* 2. תוסיפי את השורה הזו באופן זמני: */}
      {/* <AddCancellation 
        classroomId="123" 
        classroomName="חדר בדיקה 101" 
        onClose={() => console.log('החלון נסגר')} 
      /> */}
    </div>
  )
}
export default APP;