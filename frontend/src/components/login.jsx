import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Add console.log to debug request payload
      console.log('Sending login request with:', { username, password });

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username: username.trim(),
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Server response:', response.data); // Debug response

      const { token } = response.data;
      
      if (token) {
        localStorage.setItem("movieReviewToken", token);
        setSuccessMessage("Login successful!");
        setError(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
        
        onLogin(token);
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      // Improved error handling
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid username or password");
      setSuccessMessage(null);
      setTimeout(() => setError(null), 3000);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Login
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          required
          autoComplete="username"
          placeholder="Enter username or email"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={!username || !password}
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
