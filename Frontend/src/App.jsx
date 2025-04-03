import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import Login from "./pages/login/login";
import ProfilePage from "./pages/ProfilePage";

function App() {

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default App
