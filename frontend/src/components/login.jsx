import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Add console.log to debug request payload
      console.log('Sending login request with:', { email, password });

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.trim(),
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );      console.log('Server response:', response.data); // Debug response

      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem("movieReviewToken", token);
        localStorage.setItem("username", user.username);
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

  return (    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-8 bg-zinc-800 rounded-lg shadow-lg"
    >      <h2 className="text-2xl font-bold text-center mb-6 text-white">
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
      )}      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          required
          autoComplete="email"
          placeholder="Enter your email"
          className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-300 text-sm font-bold mb-2"
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
          className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>      <button
        type="submit"
        disabled={!email || !password}
        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Login
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Register now
        </Link>
      </div>
    </form>
  );
};

export default Login;
