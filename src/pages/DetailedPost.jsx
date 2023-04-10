import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {supabase} from '../client';
import './styles/DetailedPost.css';
import { Link } from 'react-router-dom';

const DetailedPost = ( {token}) => {

      let params = useParams();
      const [post, setPost] = useState([]);

      // fetch more detail about post from supabase
      useEffect(() => {
            const fetchPost = async () => {
                  const { data, error } = await supabase
                  .from('posts')
                  .select('*')
                  .eq('id', params.id)
                  .single();
                  setPost(data);
            }
            fetchPost().catch(console.error);
      }, [params.id]);


      return (
      
            <div className="detailed-post">
                  <h1>{post.title}</h1>
                  <p>{post.content}</p>
                  
                  <div className='buttonDiv'>
                  {post.user_id === token.user.id ? (
                        <button className='upvotesBtn' disabled>
                              {post.upvotes || 0} △
                        </button>
                  ) : (
                        <button className='upvotesBtn' onClick={() => updateUpvote(post.id)}>{post.upvotes} ▲</button>
                  )}
                  {post.user_id === token.user.id ? <Link to={`/edit/${post.id}`}><button className='editBtn'>Edit</button> </Link> : null}

                  </div>
            </div>
      
      );
      };
      
      export default DetailedPost;