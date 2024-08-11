import React from "react";
import { useAuth } from "../../../AuthContext";
import DistributorPage from "../../DistributorPage/DistributorPage";
import FarmerPage from "../../FarmerPage/FarmerPage";
import ManufacturerPage from "../../ManufacturerPage/ManufacturerPage";
import ShopsPage from "../../ShopsPage/ShopsPage";
import TraderPage from "../../TraderPage/TraderPage";
import UserPage from "../../UserPage/UserPage";

const HomePage: React.FC = () => {
  const { userType } = useAuth();

  const renderContent = () => {
    switch (userType) {
      case "Farmer":
        return <FarmerPage />;
      case "Trader":
        return <TraderPage />;
      case "Manufacturer":
        return <ManufacturerPage />;
      case "Distributor":
        return <DistributorPage />;
      case "Shops":
        return <ShopsPage />;
      case "User":
        return <UserPage />;
      default:
        return <div>Unknown user type. Please contact support.</div>;
    }
  };

  return <div className="p-4">{renderContent()}</div>;
};

export default HomePage;
