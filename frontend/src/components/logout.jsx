import React from "react";

const Logout = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem("movieReviewToken");

    onLogout();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 text-sm sm:text-base"
    >
      Logout
    </button>
  );
};

export default Logout;
