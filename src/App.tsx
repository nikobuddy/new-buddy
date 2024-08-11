import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPasswordPage from "./Auth/ForgotPasswordPage";
import LoginPage from "./Auth/LoginPage";
import SignUpPage from "./Auth/SignUpPage";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "./pages/error/error_page";
import Navbar from "./pages/home/components/Navbar";
import HomePage from "./pages/home/page/home_page";

// User type specific pages
import DistributorPage from "./pages/DistributorPage/DistributorPage";
import FarmerPage from "./pages/FarmerPage/FarmerPage";
import ManufacturerPage from "./pages/ManufacturerPage/ManufacturerPage";
import ShopsPage from "./pages/ShopsPage/ShopsPage";
import TraderPage from "./pages/TraderPage/TraderPage";
import UserPage from "./pages/UserPage/UserPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="pt-16">
          {" "}
          {/* Adjust the pt-16 to control the spacing */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route path="/farmer" element={<FarmerPage />} />
            <Route path="/trader" element={<TraderPage />} />
            <Route path="/manufacturer" element={<ManufacturerPage />} />
            <Route path="/distributor" element={<DistributorPage />} />
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/user" element={<UserPage />} />

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
