import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateListing from "./pages/CreateListing";
import SpaceDetails from "./pages/SpaceDetails";
import Bookinglist from "./pages/Bookinglist";
import PropertyList from "./pages/PropertyList";
import OwnerDashboard from "./pages/OwnerDashboard";
import { Category } from "@mui/icons-material";
import Categorypage from "./pages/Categorypage";
import Searchpage from "./pages/Searchpage";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSpaces from "./pages/admin/AdminSpaces";
import AdminBookings from "./pages/admin/AdminBookings";

function App() {
  return (
    <div >
            <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<SpaceDetails />} />
          <Route path="/properties/category/:category" element={<Categorypage />} />
          <Route path="/properties/search/:search" element={<Searchpage />} />
          <Route path="/users/:userId/bookings" element={<Bookinglist />} />
          <Route path="/users/:userId/properties" element={<PropertyList />} />
          <Route path="/owners/:ownerId/bookings" element={<OwnerDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="spaces" element={<AdminSpaces />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>


          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
