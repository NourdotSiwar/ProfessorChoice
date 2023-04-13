import React from 'react';
import { supabase } from '../client';
import styles from './styles/CreatePost.module.css';

const CreatePost = () => {

    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [user, setUser] = React.useState(null);


    React.useEffect(() => {
        const session = supabase.auth.session;
        setUser(session?.user ?? null);

        const {
            data: authListener,
        }  = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null); });

        return () => {
            authListener.unsubscribe;
        };
    }, [supabase]);

      const createPost = async (event) => {
            event.preventDefault();

        const flair = document.querySelector('input[name="flair"]:checked').value;

         await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single();

        const user_id = user.id;

        const { data: post_data, error } = await supabase
        .from('posts')
        .insert({
            title, content, user_id, flair
        })
        .select();

        if (error) {
            console.log('Error inserting data:', error);
        } else {
            console.log('Data inserted successfully:', post_data);
        }
    
         // Redirect to the gallery page
        window.location = "/dashboard";
    }
        

    return (
        <div>
            <form>

            <div className={styles.flag}>
                <input type="radio" id="opinion" name="flair" value="opinion" />
                <label htmlFor="opinion">opinion</label>
                <input type="radio" id="question" name="flair" value="question"/>
                <label htmlFor="question">question</label>
                </div>


                  <div className='form-group'>
                        <label htmlFor='title'>Title</label>
                        <input type='text' value={title} onChange={(e) => setTitle(e.target.value)
                        } id='title' name="title" />
                  </div>

                  <div className='form-group'>
                        <label htmlFor='content'>Content</label>
                        <textarea id='content' value={content} onChange={(e) => setContent(e.target.value)}
                         type='text' name="content"></textarea>
                  </div>

            

                  
                  <input type="submit" value="Submit" onClick={createPost} />

            </form>
        </div>
    )
}

export default CreatePost;