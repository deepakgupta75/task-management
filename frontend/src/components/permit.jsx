import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Permit = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // To store success/error messages
  const [error, setError] = useState(""); // To store error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "https://task-management-ev3y.onrender.com/api/auth/login"
      : "https://task-management-ev3y.onrender.com/api/auth/signup";
    const userData = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await axios.post(url, userData);
      const { token, user } = res.data; // Assume token and user are returned from the server

      // Store token in localStorage
      localStorage.setItem("authToken", token);

      // Store user information in state
      setUser(user);

      // Clear any previous errors
      setError("");

      // Show success message
      if (isLogin) {
        setMessage("Successfully logged in");
      } else {
        setMessage("New user registered successfully");
      }

      // Navigate to TaskPage
      navigate("/api/tasks");
    } catch (error) {
      // If the user is not registered or there's another error, handle it
      if (error.response && error.response.data && error.response.data.error) {
        // Set error message based on the server response
        setError(error.response.data.error);
      } else {
        // Generic error handling
        setError("Error during authentication");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[url('/bg.jpeg')] bg-cover bg-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200"
      >
        {!isLogin && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 transition"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 transition"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 transition"
        />

        {/* Display error message */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Display success message */}
        {message && (
          <p className="text-green-500 mb-4 text-center">{message}</p>
        )}

        <button className="bg-blue-600 text-white w-full py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(""); // Clear error when switching modes
          }}
          className="mt-4 text-blue-600 text-center hover:underline transition"
        >
          {isLogin ? "New user? Sign up" : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
};

export default Permit;
