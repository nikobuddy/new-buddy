import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const HomePage: React.FC = () => {
  const { userType } = useAuth();

  if (!userType) {
    return <div>Loading...</div>; // or redirect to login if userType is not available
  }

  switch (userType) {
    case "Farmer":
      return <Navigate to="/farmer" />;
    case "Trader":
      return <Navigate to="/trader" />;
    case "Manufacturer":
      return <Navigate to="/manufacturer" />;
    case "Distributor":
      return <Navigate to="/distributor" />;
    case "Shops":
      return <Navigate to="/shops" />;
    case "User":
      return <Navigate to="/user" />;
    default:
      return <Navigate to="/error" />;
  }
};

export default HomePage;
