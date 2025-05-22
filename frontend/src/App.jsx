import './App.css'
import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Login from './components/login'
import Logout from './components/logout'
import Navigation from './components/Navigation'

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
  };

  return(
    <Router>
      <div className='min-h-screen bg-gray-100'>
        <Navigation/>
        <div className='container mx-auto px-4 py-8'>
          {token ? (
            <Logout onLogout={handleLogout}/>
          ): (
            <Login onLogin={handleLogin}/>
          )}
          {/* movie related components will be added here */}
        </div>
      </div>
    </Router>
  );
}

export default App
