import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BrowseAssets from "./pages/BrowseAssets";
import AssetDetails from "./pages/AssetDetails";
import MyAllocations from "./pages/MyAllocations";
import RaiseRequest from "./pages/RaiseRequest";
import ServiceRequest from "./pages/ServiceRequest";
import ManageAssets from "./pages/ManageAssets";
import ManageEmployees from "./pages/ManageEmployees";
import AuditRequests from "./pages/AuditRequests";
import ServiceRequests from "./pages/ServiceRequests";
import ManageCategories from "./pages/ManageCategories";

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
            <Route path="/dashboard" element = {<Dashboard/>}></Route>

            <Route path="/assets/browse" element={<BrowseAssets />} />
            <Route path="/assets/:id" element={<AssetDetails />} />
            <Route path="/allocations" element={<MyAllocations />} />
            <Route path="/requests/new" element={<RaiseRequest />} />
            <Route path="/requests/service" element={<ServiceRequest />} />


            <Route path="/admin/assets" element={<ManageAssets />} />
            <Route path="/admin/employees" element={<ManageEmployees />} />
            <Route path="/admin/audit" element={<AuditRequests />} />
            <Route path="/admin/service-requests" element={<ServiceRequests />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
          </Routes>
        </div>

      {/* Footer */}
      <Footer/>

    </div>
    </BrowserRouter>
    </>
  )
}