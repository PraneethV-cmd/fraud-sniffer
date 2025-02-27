import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
<<<<<<< HEAD
import HomePage from "./HomePage";
=======
import Example from "./components/HomePageComp1";
>>>>>>> f856e834607da2638cf2282e63a6fcbfd50ddf6d

function App() {

  // return (
  //   <Routes>
  //     <Route path="/" element={<Home />} />
  //   </Routes>
  // )

  return (
<<<<<<< HEAD
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
=======
    <>
      <Example />
    </>
>>>>>>> f856e834607da2638cf2282e63a6fcbfd50ddf6d
  )
}

export default App
