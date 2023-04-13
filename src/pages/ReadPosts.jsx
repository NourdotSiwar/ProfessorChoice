import React, { useState, useEffect} from 'react';
import { supabase } from '../client';
import styles from './styles/ReadPosts.module.css';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Loading from '../components/Loading';

const ReadPosts = ({token}) => {

      const [post, setPost] = useState([]);
      const [order, setOrder] = useState('newest');
      const [upvotes, setUpvotes] = useState({});
      const [searchInput, setSearchInput] = useState('')
      const [flair, setFlair] = useState('')
      const [filteredPosts, setFilteredPosts] = useState([])
      const [loading, setLoading] = useState(false);

            const filterPosts = () => {
                  return post.filter((post) => {
                        const postFlair = post.flair.toLowerCase();
                        const postTitle = post.title.toLowerCase();
                        const postContent = post.content.toLowerCase();
                        return postFlair.includes(flair.toLowerCase()) && (postTitle.includes(searchInput.toLowerCase()) || postContent.includes(searchInput.toLowerCase()));
                  });
            };

            const searchPost = () => {
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
                  setLoading(true);
                  setTimeout(async () => {
                  const { data, error } = await supabase
                        .from('posts')
                        .select('*', { count: 'exact' })
                        .order('created_at', { ascending: order === 'oldest' })
                        setLoading(false);

                        if (error) {
                              console.log(error);
                            } else {
                              setPost(data);
                            }
                  }, 500);
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
            <div className={styles['posts-section']}>

                      <h3 className={styles['welcome-message']}>Welcome, {token.user.user_metadata.full_name.split(' ')[0]}</h3>

                        <div className={styles['search-bar']}>
                        <input type="text" placeholder="Search..." onChange={handleSearch} />     
                        <button className={styles['clear-btn']} onClick={clearFilter}>Clear</button>
                        </div>

                        <div className={styles['order-by-container']}>
                        <p> Filter by: </p> 
                              <button onClick={() => setOrder('newest')} disabled={order === 'newest'}>Newest</button>
                              <button onClick={() => setOrder('oldest')} disabled={order === 'oldest'}>Oldest</button>
                        </div>

                        <div className={styles['filter-container']}>
                        <button onClick={() => setFlair('')} disabled={flair === ''}>All</button>
                        <button onClick={() => setFlair('question')} disabled={flair === 'question'}>Questions</button>
                        <button onClick={() => setFlair('opinion')} disabled={flair === 'opinion'}>Opinions</button>
                        </div>

                        {loading && <Loading />}
                        {!loading && (
                        <div className={styles['post-container']}>
                        
                        {filteredPosts.map((post) => (
                               <div className={styles['post']} key={post.id}>
                                    
                                    <Link style={{color:'teal', textDecoration: 'none'}} to={`/post/${post.id}`}><div>
                                    <div className={`${styles.flair} ${styles[`flair-${post.flair.toLowerCase()}`]}`}>{post.flair}</div>
                                    <p>{moment(post.created_at).fromNow()}</p>
                                    <h3>{post.title}</h3>
                                    <div>
                                    <p>{post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content} <Link className={styles['read-more']} style={{color:'black'}} to={`/post/${post.id}`}>More
                                    </Link></p></div>
                                    </div></Link>

                                    <div className={styles['button-container']}>
                                          {post.user_id === token.user.id ? (
                                                <button className={styles['upvotes-btn']} disabled> {post.upvotes || 0} △</button>
                                          ) : (
                                                <button className={styles['upvotes-btn']} onClick={() => updateUpvote(post.id)}>{post.upvotes} ▲</button>
                                          )}

                                    {post.user_id === token.user.id &&
                                          <Link to={`/edit/${post.id}`}><button className={styles['edit-btn']}>Edit</button> </Link>}
                                    </div>
                              </div>
                        ))}
            </div>
            )}
            </div>
      )}


export default ReadPosts;

