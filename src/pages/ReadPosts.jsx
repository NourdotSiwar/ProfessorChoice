import React, { useState, useEffect} from 'react';
import { supabase } from '../client';
import './styles/ReadPosts.css';
import { Link } from 'react-router-dom';

const ReadPosts = ( {token}) => {

      const [posts, setPosts] = useState([]);
      const [order, setOrder] = useState('newest');
      const [upvotes, setUpvotes] = useState({});

            // this is the state that will be used to store the search input
            const [searchInput, setSearchInput] = useState('')

            // this is the state that will be used to store the filtered results
            const [filteredResults, setFilteredResults] = useState([])

            // function that will search for posts by title 
            const searchPosts = (searchInput) => {
                  return posts.filter((post) => {
                        const postTitle = post.title.toLowerCase();
                        return postTitle.includes(searchInput.toLowerCase());
                  });
            };

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
            <div className='read-posts-div'>
                      <h3>Welcome, {token.user.user_metadata.full_name.split(' ')[0]}</h3>

                        <div className='search-container search-bar'>
                        <input type="text" placeholder="Search..." 
                        onChange={(e) => setSearchInput(e.target.value)} />
                        
                        </div>

                        <div className='order-by-container'>
                        <p> Order by: </p> 
                              <button onClick={() => setOrder('newest')} disabled={order === 'newest'}>Newest</button>
                              <button onClick={() => setOrder('oldest')} disabled={order === 'oldest'}>Oldest</button>
                       
                        </div>

                        {searchInput.length > 0 ? 

                               <div className='posts-container'>
                                    {searchPosts(searchInput).map((post) => (
                                          <div className='post' key={post.id}>
                                                <p>{new Date(post.created_at).toLocaleString()}</p>
                                                <Link to={`/post/${post.id}`}><h3>{post.title}</h3></Link>
                                                <p>{post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content} </p>

                                                <div className='buttonDiv'>
                                                      {post.user_id === token.user.id ? (
                                                            <button className='upvotesBtn' disabled>
                                                                  {post.upvotes || 0} △
                                                            </button>
                                                      ) : (
                                                            <button className='upvotesBtn' onClick={() => updateUpvote(post.id)}>{post.upvotes} ▲</button>
                                                      )}

                                                {post.user_id === token.user.id &&
                                                <Link to={`/edit/${post.id}`}><button className='editBtn'>Edit</button> </Link>}
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        :
                        <div className='posts-container'>
                              {posts.map((post) => (
                                    <div className='post' key={post.id}>
                                          <p>{new Date(post.created_at).toLocaleString()}</p>
                                          <Link to={`/post/${post.id}`}><h3>{post.title}</h3></Link>
                                                <p>{post.content.length > 100 ? post.content.substring(0, 100) + '...' :post.content}</p>

                                          <div className='buttonDiv'>
                                                {post.user_id === token.user.id ? (
                                                      <button className='upvotesBtn' disabled>
                                                            {post.upvotes || 0} △
                                                      </button>
                                                ) : (
                                                      <button className='upvotesBtn' onClick={() => updateUpvote(post.id)}>{post.upvotes} ▲</button>
                                                )}

                                          {post.user_id === token.user.id &&
                                          <Link to={`/edit/${post.id}`}><button className='editBtn'>Edit</button> </Link>}
                                          </div>
                                    </div>
                              ))}
                        </div>

                                    
                        }


            </div>
      )
      }

export default ReadPosts;

