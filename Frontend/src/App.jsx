import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import HomePage from "./HomePage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App
