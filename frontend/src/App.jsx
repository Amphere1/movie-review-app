import './App.css'
import React, {useState, useEffect} from 'react'
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
    <div className='App'>
      <Navigation/>
      {token ? (
        <Logout onLogout={handleLogout}/>
      ): (
        <Login onLogin={handleLogin}/>
      )}
      {/* movie related components will be added here */}

    </div>
  );
}

export default App
