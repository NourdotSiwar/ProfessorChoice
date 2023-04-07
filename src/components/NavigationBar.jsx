import React, { useState } from 'react';
import './NavigationBar.css';
import { Link } from 'react-router-dom';
import {supabase } from '../client';

const NavigationBar = () => {

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
            <Link style={{color: 'white', textDecoration: "none"}} to="/">Dashboard</Link>
          </li>
          <li>
           <Link style={{color: 'white', textDecoration: "none"}} to="/createPost">Create Post</Link>
          </li>
          <li>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;
