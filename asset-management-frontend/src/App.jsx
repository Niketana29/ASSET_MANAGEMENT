import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App(){


  return(
    <>
    <BrowserRouter>
    
    <div>
      {/* Navbar */}
      <Navbar/>

      {/* Routing to Home Page , Regiter Page and Login Page */}
      <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>

      {/* Footer */}
      <Footer/>

    </div>
    </BrowserRouter>
    </>
  )
}