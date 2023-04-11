import { useState } from 'react';
import { supabase } from '../client'
import { Link } from 'react-router-dom';
import "./styles/SignUp.css"

const SignUp = () => {

    const [formData, setFormData] = useState({
            fullName: '',
            email: '',
            password: '',
    })

    console.log(formData);

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

            try {
                  const { data, error } = await supabase.auth.signUp(
                    {
                      email: formData.email,
                      password: formData.password,
                      options: {
                        data: {
                          full_name: formData.fullName,
                        }
                      }
                    }
                  )
                  if (error) throw error
                  alert('Check your email for verification link')
            }
            catch(error) {
                  console.error(error);
            }    
      }      
  

  return (
    <div className="login-container">
    <h1 className="login-heading">Sign Up</h1>
            <form onSubmit={handleSubmit}>

                  <input 
                  placeholder='full name'
                  name='fullName'
                  onChange={handleChange}
                  className='login-input'
                  />

                  <input 
                  placeholder='email'
                  name='email'
                  onChange={handleChange}
                  className='login-input'
                  />

                  <input
                  placeholder='password'
                  name='password'
                  onChange={handleChange}
                  type='password'
                  className='login-input'
                  />

                  <button className='login-button' type='submit'>Sign Up</button>
            </form>
            Already have an account? <Link to='/'>Login</Link>
      </div>

      
  );
};

export default SignUp;
