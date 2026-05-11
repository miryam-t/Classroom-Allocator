import { Route, Routes } from "react-router-dom";
import  ClassroomList  from "./components/ClassroomList";
import Navbar from "./components/Navbar";
import RoomManagement from "./components/RoomManagement";
import SearchClass from "./components/SearchClass";
function APP(){
  return(
   
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ClassroomList />} />
        <Route path="/SearchClass" element={<SearchClass />} />
        <Route path="/room-management" element={<RoomManagement />} />
        {/* כשחברות יסיימו את הקומפוננטות שלהן - להוסיף כאן */}
        {/* <Route path="/allocate" element={<Allocate />} /> */}
        {/* <Route path="/reports" element={<Reports />} /> */}
      </Routes>
      </>
  )
}
export default APP;