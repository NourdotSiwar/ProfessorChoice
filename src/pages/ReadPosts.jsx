import React, { useState, useEffect} from 'react';
import { supabase } from '../client';
import './styles/ReadPosts.css';


const readPosts = ({token}) => {

      const [posts, setPosts] = useState([]);
      const [order, setOrder] = useState('newest');

      useEffect(() => {
            const fetchPosts = async () => {
                  const { data, error } = await supabase
                        .from('posts')
                        .select('*', { count: 'exact' })
                        .order('created_at', { ascending: order === 'oldest' })
                  
                        if (error) {
                              console.log(error);
                            } else {
                              setPosts(data);
                            }
                };
                
            fetchPosts().catch(console.error);
          }, [order]);

          const [upvotes, setUpvotes] = useState({});

          const updateUpvote = async (postId) => {
            const { error } = await supabase
            .from('posts')
            .update({ upvotes: (upvotes[postId] || 0) + 1 })
            .eq('id', postId)

            if(error) console.log('error updating upvote:', error)
            else {
                  const updatedPost = posts.find((post) => post.id === postId);
                  updatedPost.upvotes = (updatedPost.upvotes || 0) + 1;
                  setUpvotes({ ...upvotes, [postId]: updatedPost.upvotes });
                  setPosts([...posts]);
            }

        }
   
      return (
            <div>
                      <h3>welcome back, {token.user.user_metadata.full_name }</h3>
                        <div className='order-by-container'>
                        <p> Order by: </p> 
                              <button onClick={() => setOrder('newest')} disabled={order === 'newest'}>Newest</button>
                              <button onClick={() => setOrder('oldest')} disabled={order === 'oldest'}>Oldest</button>
                       
                        </div>
                              <div className='posts-container'>
                                    {posts && posts.length > 0 ?
                                    posts.map((post) => (
                                          <div className='post' key={post.id}>
                                                <p>{new Date(post.created_at).toLocaleString()}</p>
                                                <h3>{post.title}</h3>
                                                <p>{post.content}</p>
                                                <button className='upvotesBtn' onClick={() => updateUpvote(post.id)}>👍: {post.upvotes}</button>
                                          </div>
                                    )) : (
                                          <div className='no-posts'>
                                                <p>There are no posts yet</p>
                                          </div>
                                    )}
                                    </div>
            </div>
      )
      }

export default readPosts;