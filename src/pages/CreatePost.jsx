import React, { useState } from 'react';
import { supabase } from '../client';
import styles from './styles/CreatePost.module.css';


const CreatePost = () => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [user, setUser] = useState(null);
    const [flair, setFlair] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [isQuestionOpen, setIsQuestionOpen] = useState(false);
    const [isOpinionOpen, setIsOpinionOpen] = useState(false);

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

    const handleContentChange = (event) => {
        setContent(event.target.value);
        setCharCount(event.target.value.length);
      };
    
    const handleEmptyForm = (event) => {
        event.preventDefault();
      
        if (title === '' || content === '' || flair === '' || content.length < 100) {
          let message = '';
          if (flair === '') {
            message += 'Flair required.\n';
          }
          if (title === '') {
            message += 'Professor name required.\n'
          }
          if (content === '') {
            message += 'Text required.\n'
          }
          if(flair === 'question' && content.length < 100) {
            message += 'Question must be at least 100 characters.\n';
            }
        if (flair === 'opinion' && content.length < 250) {
            message += 'Opinion must be at least 250 characters.\n';
            }
          setErrorMessage(message);
        } else {
          createPost(event);
        }
      };


                
    return (
        
        <div className={styles.createPostDiv}>
            <form>
                <h2>Write/Ask about a Professor!</h2>

                <div className={styles.flag}>
                <button onClick={() => setFlair('question')} className={styles.question} disabled={flair === 'question'}>question</button>
                <button onClick={() => setFlair('opinion')} className={styles.opinion} disabled={flair === 'opinion'}>opinion</button>
                </div>

                  <div> 
                        <input className={styles.title} type='text' value={title} onChange={(e) => setTitle(e.target.value)
                        } id='title' name="title" placeholder='Professor Name'/>
                  </div>

                  <div>
                        <textarea className={styles.content} id='content' value={content} onChange={handleContentChange}
                         type='text' name="content" placeholder="Text"></textarea>
                        <div style={{textAlign: 'right'}}> Character count: {charCount}
                         </div>
                  </div> 

            </form>

            <div>
                {errorMessage && <p className={styles.error}>{
                    errorMessage.split('\n').map((item, key) => {
                        return <span className={styles.error} key={key}>{item}<br/></span>
                    }) }</p>}
                <button className={styles.submitPost} onClick={handleEmptyForm }>Submit</button>
            </div>

            <div className={styles.stuck}>
                <div className={styles.dropdownQuestion}>
                <button className={styles.dropdownButton} onClick={() => setIsQuestionOpen(!isQuestionOpen)}>
                <span className={styles.dropdownArrow} style={{transform: isQuestionOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}}
                ></span>
                </button><h4>Stuck on asking about a professor?</h4>
                </div>
                <ul className={isQuestionOpen ? styles.dropdownListOpen : styles.dropdownListClosed}>
                        <li>Ask about professor's teaching style</li>
                        <li>Ask about professor's grading</li>
                        <li>Ask about professor's office hours</li>
                        <li>Ask about professor's availability</li>
                        <li>Ask about professor's personality</li>
                        <li>Ask about professor's quizzes</li>
                        <li>Ask about professor's exams</li>
                    </ul>
                
                <div className={styles.dropdownOpinion}>
                <button className={styles.dropdownButton} onClick={() => setIsOpinionOpen(!isOpinionOpen)}>
                <span className={styles.dropdownArrow} style={{transform: isOpinionOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}}
                ></span>
                </button><h4>Stuck on writing an opinion?</h4>
                </div>
                <ul className={isOpinionOpen ? styles.dropdownListOpen : styles.dropdownListClosed}>
                        <li>Talk about Professor's teaching style</li>
                        <li>Talk about Professor's grading</li>
                        <li>Talk about Professor's office hours</li>
                        <li>Talk about Professor's availability</li>
                        <li>Talk about Professor's personality</li>
                        <li>Talk about Professor's quizzes</li>
                        <li>Talk about Professor's exams</li>
                    </ul>
                

            </div>
        </div>
    )
}

export default CreatePost;