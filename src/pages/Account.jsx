import React, { useState, useEffect } from 'react'
import { supabase } from '../client'
import './styles/Account.css'
import { useNavigate } from 'react-router-dom';

const Account = ({token}) => {
      const [user, setUser] = useState(null)

      let navigate = useNavigate();

      const handleLogout = () => {
            sessionStorage.removeItem('token');
            navigate('/login');
      }

      useEffect(() => {
            const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
                  setUser(session?.user ?? null)
            })

            return () => {
                  authListener.unsubscribe
            }
      }, [])

      if (!user) {
            return <div>Loading...</div>
      }
      
      return (
            <div className="account-container">
              <h1 className="account-header">Account</h1>
              <div className="account-details">
                <p>Name: {user.user_metadata.full_name}</p>
                <p>Email: {user.email}</p>
              </div>
              <button onClick={handleLogout}>Sign Out</button>
            </div>
          )
        }

export default Account;