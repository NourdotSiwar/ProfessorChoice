import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/NavigationBar.module.css';

const NavigationBar = () => {

  return (
    <div>
    <nav>
      <div>
        <a className={styles.title} href="/dashboard">ProfessorChoice</a>
      </div>
        <ul >
          <li>
            <Link style={{color: '#2a96a1', textDecoration: "none"}} to="/dashboard">Dashboard</Link>
          </li>
          <li>
           <Link style={{color: '#2a96a1', textDecoration: "none"}} to="/create">Create Post</Link>
          </li>
          <li>
            <Link style={{color: '#2a96a1', textDecoration: "none"}} to="/account">Account</Link>
          </li>
        </ul>
    </nav>
    
    <div className={styles.footer}>
      <p>ProfessorChoice</p>
      <p>
        <a href="https://github.com/NourdotSiwar/ProfessorChoice">GitHub</a>
      </p>
      <p>© 2023</p>
      </div>
    </div>
  );
}

export default NavigationBar;
