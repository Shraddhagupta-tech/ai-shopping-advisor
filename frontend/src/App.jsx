import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./pages/registration"
import Login from "./pages/login";

function App() {
  return <BrowserRouter>
<Routes>
  <Route path='/register' element={<Registration/>}/>
  <Route path='/login' element={<Login/>}/>
</Routes>
  </BrowserRouter>
 
}

export default App
