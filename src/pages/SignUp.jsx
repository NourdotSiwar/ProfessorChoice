import { useState } from 'react';
import { supabase } from '../client'
import { Link } from 'react-router-dom';
import styles from './styles/SignUpLogIn.module.css';

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
        
            const { user, session, error } = await supabase.auth.signUp({
                  email: formData.email,
                  password: formData.password,
            })

            if (error) {
                  console.log(error)
                  return
            }

            const { data, error: errorUpdate } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                userName: formData.userName,
                full_name: formData.fullName,
              }
            ])

            if (errorUpdate) {
              console.log(errorUpdate)
              return
            }
      }      
  

  return (
    <div className={styles.container}>
    <h1 className={styles.heading}>Sign Up</h1>
            <form onSubmit={handleSubmit}>

                  <input 
                  placeholder='user name'
                  name='userName'
                  onChange={handleChange}
                  className={styles.input}
                  />

                  <input 
                  placeholder='full name'
                  name='fullName'
                  onChange={handleChange}
                  className={styles.input}
                  />

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

                  <button className={styles.signupBtn} type='submit'>Sign Up</button>
            </form>
            Already have an account? <Link to='/'>Login</Link>
      </div>

      
  );
};

export default SignUp;
