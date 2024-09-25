import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set user data
    }
  }, []);

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem("user"); // Remove user data on logout
    navigate("/api/auth/login");
  };

  return (
    <nav className="bg-blue-700 bg-opacity-80 backdrop-blur-md p-1 flex items-center justify-between rounded-lg shadow-lg sticky top-0 z-50">
      <div>
        <img
          src="/logobg.png"
          alt="logo"
          className="w-12 h-12 md:w-16 md:h-16 object-contain"
        />
      </div>

      <div className="flex-grow text-center">
        <h1 className="text-white font-bold text-2xl">Task Management</h1>
      </div>

      <div className="flex items-center justify-end">
        {user ? (
          <>
            <span className="mr-4 text-white">Welcome, {user.name}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/api/auth/login")}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
