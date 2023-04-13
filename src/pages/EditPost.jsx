import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useParams } from 'react-router-dom';
import './styles/EditPost.css';

const EditPost = () => {

      const {id} = useParams();
      const [post, setPost] = useState(null);

      useEffect(() => {
            const fetchPost = async () => {
                  const { data } = await supabase
                  .from('posts')
                  .select()
                  .eq('id', id)

                  if (data.length > 0) {
                        setPost(data[0]);
                  }
            }
            fetchPost().catch(console.error);
      }, [id]);

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

      if (!post) {
            return <div>Loading...</div>
      }
      
      return (
            <div className="edit-post">
            <h2>Edit Post</h2>
            <form onSubmit={updatePost}>

            <div className="flair">
            <input type="radio" id="opinion" name="flair" value="opinion" checked={post.flair === 'opinion'} onChange={(e) => setPost({...post, flair: e.target.value})} />
            <label htmlFor="opinion">opinion</label>
            <input type="radio" id="question" name="flair" value="question" checked={post.flair === 'question'} onChange={(e) => setPost({...post, flair: e.target.value})} />
            <label htmlFor="question">question</label>

            </div>

              <label htmlFor="title">Title:</label>
              <input type="text" id="title" name="title" value={post.title} onChange={(e) => setPost({...post, title: e.target.value})} />
      
              <label htmlFor="content">Content:</label>
              <textarea id="content" type="content" name="content" value={post.content} onChange={(e) => setPost({...post, content: e.target.value})} />
      
            <div className='updateDeleteBtns'>
              <button type="submit">Update Post</button>
              <button className="deleteBtn" onClick={deletePost}>Delete</button>
              
              </div>
            </form>
          </div>
        );
      };

export default EditPost;