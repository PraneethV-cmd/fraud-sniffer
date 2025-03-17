import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import Login from "./pages/login/login";

function App() {

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default App
