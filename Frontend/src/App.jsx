import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import Example from "./components/HomePageComp1";

function App() {

  // return (
  //   <Routes>
  //     <Route path="/" element={<Home />} />
  //   </Routes>
  // )

  return (
    <>
      <Example />
    </>
  )
}

export default App
