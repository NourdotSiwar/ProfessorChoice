import React, { useState } from 'react';
import './NavigationBar.css';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  // set initial state to false, assuming user is not logged in
  const [isLogged, setIsLogged] = useState(false);

  // function to handle login
  const handleLogin = () => {
    setIsLogged(true);
  };

  // function to handle logout
  const handleLogout = () => {
    setIsLogged(false);
  };

  // set the tile of Account link based on user's login status
  const accountTitle = isLogged ? 'Account' : 'Login / Sign Up';

  return (
    <nav>
      <div className='title-container'>
        <a className='title' href="/">ProfessorChoice</a>
      </div>
      <div className='search-container'>
        <input type="text" placeholder="Search..." />
      </div>
      <div className='menu-container'>
        <ul className='menu'>
          <li>
            <Link style={{color: 'white', textDecoration: "none"}} to="/">Home</Link>
          </li>
          <li>
           <Link style={{color: 'white', textDecoration: "none"}} to="/createPost">Create Post</Link>
          </li>
          <li>
            <Link style={{color: 'white', textDecoration: "none"}} to={isLogged ? '/account' : '/login'}>{accountTitle}</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;
