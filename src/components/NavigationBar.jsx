import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/NavigationBar.module.css';

const NavigationBar = () => {

  return (
    <nav>
      <div>
        <a className={styles.title} href="/dashboard">ProfessorChoice</a>
      </div>
      <div>
        <ul >
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
