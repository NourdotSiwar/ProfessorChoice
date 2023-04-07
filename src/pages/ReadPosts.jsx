import React from 'react';
import { useNavigate } from 'react-router-dom';


const readPosts = ({token}) => {

      let navigate = useNavigate();

      const handleLogout = () => {
            sessionStorage.removeItem('token');
            navigate('/login');
      }
      
      return (
            <div>
                      <h3>welcome back, {token.user.user_metadata.full_name }</h3>
                      <button onClick={handleLogout}>Sign Out</button>

            </div>
      )
      }

export default readPosts;