import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import RegisterCustomer from "../pages/RegisterCustomer";
import RegisterAgency from "../pages/RegisterAgency";
import AddCar from "../pages/AddCar";
import AvailableCars from "../pages/AvailableCars";
import BookedCars from "../pages/BookedCars";
import MyBookings from "../pages/MyBookings";

import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<AvailableCars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/register-agency" element={<RegisterAgency />} />

        <Route path="/add-car" element={
          <ProtectedRoute role="agency"><AddCar /></ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute role="agency"><BookedCars /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
