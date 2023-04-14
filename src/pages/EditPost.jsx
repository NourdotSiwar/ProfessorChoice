import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useParams } from 'react-router-dom';
import styles from './styles/EditPost.module.css';

const EditPost = () => {

      const {id} = useParams();
      const [post, setPost] = useState(null);
      const [charCount, setCharCount] = useState(0);
      const [errorMessage, setErrorMessage] = useState('');

      useEffect(() => {
            const fetchPost = async () => {
                  const { data } = await supabase
                  .from('posts')
                  .select()
                  .eq('id', id)

                  setPost(data[0]);
            }
            fetchPost().catch(console.error);
      }, [id]);

      useEffect(() => {
            setCharCount(post?.content?.length || 0);
          }, [post]);

      const updatePost = async (e) => {
            e.preventDefault();

            await supabase
            .from('posts')
            .update({ 
                  title: post.title,
                  content: post.content,
                  flair: post.flair
                   })
            .eq('id', id)

             window.location.href = '/dashboard';
      }

      const deletePost = async (e) => {
            e.preventDefault();

            await supabase
            .from('posts')
            .delete()
            .eq('id', id)

            
            window.location.href = '/dashboard';
      }

      const handleContentChange = (event) => {
      setContent(event.target.value);
      setCharCount(event.target.value.length);
      };

      const handleEmptyForm = (event) => {
      event.preventDefault();

      if (post.title === '' || post.content === '' || 
      (post.flair === 'question' && post.content.length < 100) ||
      (post.flair === 'opinion' && post.content.length < 250)) {
      let message = '';
      if (post.title === '') {
      message += 'Professor name required.\n'
      }
      if (post.content === '') {
      message += 'Text required.\n'
      }
      if(post.flair === 'question' && post.content.length < 100) {
      message += 'Question must be at least 100 characters.\n';
      }
      if (post.flair === 'opinion' && post.content.length < 250) {
      message += 'Opinion must be at least 250 characters.\n';
      }
      setErrorMessage(message);
      } else {
      updatePost(event);
      }
      };

      
      return (
            <div className={styles.editPostDiv}>
            <h2>Edit Post</h2>
            <form>

            <div className={styles.flag}>
                <button className={styles.question} disabled={post?.flair === 'question'}
                 onClick={() => setPost({...post, flair: 'question'})}>question </button>
                <button className={styles.opinion} disabled={post?.flair === 'opinion'}
                    onClick={() => setPost({...post, flair: 'opinion'})}>opinion</button>
                </div>

            <div> 
            <input className={styles.title} type='text' value={post?.title || ''} onChange={(e) => setPost({...post, title: e.target.value})}
            id='title' name="title" placeholder='Professor Name'/>
            </div>

            <textarea className={styles.content} id='content' value={post?.content || ''} onChange={
                  (e) => setPost({...post, content: e.target.value})} type='text' name="content" placeholder="Text"></textarea>
            <div style={{textAlign: 'right'}}> Character count: {charCount}</div> 
            </form>
      
            <div>
                {errorMessage && <p className={styles.error}>{
                    errorMessage.split('\n').map((item, key) => {
                        return <span className={styles.error} key={key}>{item}<br/></span>
                    }) }</p>}
                <button className={styles.updatePost} onClick={handleEmptyForm}>Update</button>
                <button className={styles.deletePost} onClick={deletePost}>Delete</button>
            </div>
          </div>
        );
      };

export default EditPost;