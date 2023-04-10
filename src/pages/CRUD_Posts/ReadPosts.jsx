import React, { useState, useEffect} from 'react';
import { supabase } from '../../client';
import '../styles/ReadPosts.css';
import { Link } from 'react-router-dom';

const ReadPosts = ( {token}) => {

      const [post, setPost] = useState([]);
      const [order, setOrder] = useState('newest');
      const [upvotes, setUpvotes] = useState({});
      const [searchInput, setSearchInput] = useState('')
      const [flair, setFlair] = useState('')
      const [filteredPosts, setFilteredPosts] = useState([])

            const filterPosts = (posts) => {
                  return posts.filter((post) => {
                        const postFlair = post.flair.toLowerCase();
                        const postTitle = post.title.toLowerCase();
                        const postContent = post.content.toLowerCase();
                        return postFlair.includes(flair.toLowerCase()) && (postTitle.includes(searchInput.toLowerCase()) || postContent.includes(searchInput.toLowerCase()));
                  });
            };

            const searchPost = (posts) => {
                  return post.filter((post) => {
                        const postTitle = post.title.toLowerCase();
                        const postContent = post.content.toLowerCase();
                        return postTitle.includes(searchInput.toLowerCase()) || postContent.includes(searchInput.toLowerCase());
                  });
            };

            useEffect(() => {
                  let filtered = filterPosts(post);
                  if(searchInput !== '') {
                        filtered = searchPost(filtered);
                  }
                  setFilteredPosts(filtered);
            }, [flair, searchInput, post]);

            const handleSearch = (e) => {
                  const searchTerm = e.target.value;
                  setSearchInput(searchTerm);
            };
      

      useEffect(() => {
            const fetchPost = async () => {
                  const { data, error } = await supabase
                        .from('posts')
                        .select('*', { count: 'exact' })
                        .order('created_at', { ascending: order === 'oldest' })
                  
                        if (error) {
                              console.log(error);
                            } else {
                              setPost(data);
                            }
                };
                
            fetchPost().catch(console.error);
          }, [order]);

          const updateUpvote = async (postId) => {

            const { error } = await supabase
            .from('posts')
            .update({ upvotes: (upvotes[postId] || 0) + 1 })
            .eq('id', postId)

            if(error) console.log('error updating upvote:', error)
            else {
                  const updatedPost = post.find((post) => post.id === postId);
                  updatedPost.upvotes = (updatedPost.upvotes || 0) + 1;
                  setUpvotes({ ...upvotes, [postId]: updatedPost.upvotes });
                  setPost([...post]);
            }

        }

          

      const clearFilter = () => {
            setSearchInput('')
            document.querySelectorAll('input[type=text]').forEach((el) => el.value = '');
      }

      return (
            <div className='read-post-div'>
                      <h3>Welcome, {token.user.user_metadata.full_name.split(' ')[0]}</h3>

                        <div className='search-container search-bar'>
                        <input type="text" placeholder="Search..." 
                        onChange={handleSearch} />     
                        <button className='clearBtn' onClick={clearFilter}>Clear</button>
                        </div>

                        <div className='order-by-container'>
                        <p> Filter by: </p> 
                              <button onClick={() => setOrder('newest')} disabled={order === 'newest'}>Newest</button>
                              <button onClick={() => setOrder('oldest')} disabled={order === 'oldest'}>Oldest</button>
                        </div>

                        <div className='filter-container'>
                        <button onClick={() => setFlair('')} disabled={flair === ''}>All</button>
                        <button onClick={() => setFlair('question')} disabled={flair === 'question'}>Questions</button>
                        <button onClick={() => setFlair('opinion')} disabled={flair === 'opinion'}>Opinions</button>
                        </div>

                        <div className='post-container'>
                        {filteredPosts.map((post) => (
                              <div className='post' key={post.id}>
                                    <div className={`flair flair-${post.flair.toLowerCase()}`}>{post.flair}</div>
                                    <p>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    <Link to={`/post/${post.id}`}><h3>{post.title}</h3></Link>
                                    <div className='contentDiv'>
                                    <p>{post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content} </p></div>

                                    <div className='buttonDiv'>
                                          {post.user_id === token.user.id ? (
                                                <button className='upvotesBtn' disabled> {post.upvotes || 0} △</button>
                                          ) : (
                                                <button className='upvotesBtn' onClick={() => updateUpvote(post.id)}>{post.upvotes} ▲</button>
                                          )}

                                    {post.user_id === token.user.id &&
                                          <Link to={`/edit/${post.id}`}><button className='editBtn'>Edit</button> </Link>}
                                    </div>
                              </div>

                        ))}
            </div>
            </div>
      )}


    
export default ReadPosts;

