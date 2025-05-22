import React from "react";

const Logout = ({onLogout}) => {
  function handleLogout() {
    localStorage.removeItem("movieReviewToken");

    onLogout();
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}

export default Logout;
