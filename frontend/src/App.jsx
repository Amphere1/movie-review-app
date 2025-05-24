import './App.css'
import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Logout from './components/Logout'
import Navigation from './components/Navigation'
import SearchForm from './components/SearchForm'
import MovieList from './components/MovieList'
import Register from './components/Register'

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('movieReviewToken');
    if(storedToken){
      setToken(storedToken);
    }
  },[]);

  const handleLogin = (token) => {
    setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('movieReviewToken');
  };

  return(
    <Router>
      <div className='min-h-screen bg-zinc-900'>
        <Navigation/>
        <div className='container mx-auto px-4 py-8'>
          {token ? (
            <>
              <div className="flex justify-end mb-6">
                <Logout onLogout={handleLogout}/>
              </div>
              <Routes>
                <Route path="/" element={<SearchForm />} />
                <Route path="/search" element={<SearchForm />} />
                <Route path="/to-watch" element={<MovieList category="toWatch" />} />
                <Route path="/watched" element={<MovieList category="watched" />} />
                <Route path="/favorites" element={<MovieList category="favorite" />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Login onLogin={handleLogin} />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App
