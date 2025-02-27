import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import HomePage from "./HomePage";
import "./Homepage"

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}

export default App
