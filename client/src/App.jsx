import { Route, Routes } from "react-router-dom";
import  ClassroomList  from "./components/ClassroomList";
import Navbar from "./components/Navbar";
import RoomManagement from "./components/RoomManagement";
function APP(){
  return(
    // <div>
    //   <Navbar></Navbar>
    //   <h1>מערכת הקצאת כיתות</h1>
    //   <ClassroomList></ClassroomList>
    //   <RoomManagement></RoomManagement>
    // </div>
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ClassroomList />} />
        <Route path="/room-management" element={<RoomManagement />} />
        {/* כשחברות יסיימו את הקומפוננטות שלהן - להוסיף כאן */}
        {/* <Route path="/allocate" element={<Allocate />} /> */}
        {/* <Route path="/reports" element={<Reports />} /> */}
      </Routes>
      </>
  )
}
export default APP;