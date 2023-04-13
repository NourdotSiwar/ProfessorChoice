import { useState } from 'react';
import { supabase } from '../client'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './styles/SignUpLogIn.module.css';

const Login = ({setToken}) => {

    const [formData, setFormData] = useState({
            email: '',
            password: '',
    })

    const [passwordIncorrect, setPasswordIncorrect] = useState(false);

    let navigate = useNavigate();

    function handleChange(e) {
        setFormData((prevFormData) =>{
            return {
            ...prevFormData,
            [e.target.name]: e.target.value,
            }
        })

    }

      async function handleSubmit(e) {
            e.preventDefault();
            try{
                  const {data, error} = await supabase.auth.signInWithPassword({
                        email: formData.email,
                        password: formData.password
                  });
                 
                  if (error) throw error;
                  console.log(data);
                  setToken(data);
                  navigate('/dashboard')

            }

            catch(error) {
                  console.error(error);
                  setPasswordIncorrect(true);
            }    
      }      
  

  return (
      <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>
            <form onSubmit={handleSubmit}>
                  <input 
                  placeholder='email'
                  name='email'
                  onChange={handleChange}
                  className={styles.input}
                  />

                  <input
                  placeholder='password'
                  name='password'
                  onChange={handleChange}
                  type='password'
                  className={styles.input}
                  />

                  {passwordIncorrect && <p className={styles.error}>Incorrect email or password</p>}
                  <button className={styles.button} type='submit'>Login</button>
                  
            </form>
            Don't have an account? <Link to='/signup'>Sign Up</Link>
           
            
      </div>

      
  );
};

export default Login;