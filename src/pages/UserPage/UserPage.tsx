import React from "react";

const UserPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <p>
        Welcome, User! Here you can view your orders and update your profile.
      </p>
      {/* Add User-specific components and content here */}
    </div>
  );
};

export default UserPage;
