import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import LoginPage from "./pages/Page1";
import TaskPage from "./pages/TaskPage";
import Navbar from "./components/Navbar";
import "./index.css";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} onLogout={handleLogout} />
      <Routes>
        {/* Route to login page */}
        <Route
          path="/api/auth/login"
          element={<LoginPage setUser={setUser} />}
        />

        {/* Route to tasks page */}
        <Route path="/api/tasks" element={<TaskPage setUser={setUser} />} />

        {/* Redirect root path to login page */}
        <Route path="/" element={<Navigate to="/api/auth/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
