import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/NavigationBar.css'

const NavigationBar = () => {

  return (
    <nav>
      <div className='title-container'>
        <a className='title' href="/">ProfessorChoice</a>
      </div>
      <div className='menu-container'>
        <ul className='menu'>
          <li>
            <Link style={{color: 'white', textDecoration: "none"}} to="/dashboard">Dashboard</Link>
          </li>
          <li>
           <Link style={{color: 'white', textDecoration: "none"}} to="/create">Create Post</Link>
          </li>
          <li>
            <Link style={{color: 'white', textDecoration: "none"}} to="/account">Account</Link>
          </li>

          <li>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;
