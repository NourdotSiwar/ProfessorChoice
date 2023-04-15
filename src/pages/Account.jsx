import React, { useState, useEffect } from 'react'
import { supabase } from '../client'
import styles from './styles/Account.module.css';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Account = () => {
      const [user, setUser] = useState(null)
      const [posts, setPosts] = useState([])
      const [comments, setComments] = useState([])
      const [selectedOption, setSelectedOption] = useState('profile');
      const [savedPosts, setSavedPosts] = useState([]);
      
      const handleOptionClick = (option) => {
            setSelectedOption(option);
      };

      const handleLogout = () => {
            sessionStorage.removeItem('token');
            window.location.reload();
      }

      useEffect(() => {
            const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
                  setUser(session?.user ?? null)
            })

            return () => {
                  authListener.unsubscribe
            }
      }, [])

      useEffect(() => {
            const fetchPosts = async () => {
              if (user) {
                const { data } = await supabase
                  .from('posts')
                  .select('*')
                  .eq('user_id', user.id)
                  .order('created_at', { ascending: false })
          
                setPosts(data)
              }
            }
          
            fetchPosts().catch(console.error);
          }, [user])
          

      useEffect(() => {
            const fetchComments = async () => {
                  if(user) {
                  const { data } = await supabase
                  .from('comments')
                  .select('*')
                  .eq('user_id', user.id)
                  .order('created_at', { ascending: false })

                  setComments(data)
            }
      }

            fetchComments().catch(console.error);
      }, [user])   

      useEffect(() => {
            const fetchSavedPosts = async () => {
                  if(user){
                  const { data, error } = await supabase
                  .from('saved_posts')
                  .select('*')
                  .eq('user_id', user.id)

                  
                  if (error) console.log('error fetching saved posts:', error)
                  else {
                       const savedPostsWithDetails = await Promise.all(data.map(async (savedPost) => {
                                  const { data } = await supabase
                                  .from('posts')
                                  .select('*')
                                  .eq('id', savedPost.post_id)
                                  .maybeSingle();
                                  return data;
                           }))
                              setSavedPosts(savedPostsWithDetails);
                  }
            }
      } 

            fetchSavedPosts().catch(console.error);   
      }, [user])          


      if(!user) return (
            <div className={styles.account}>
                  <h1>Sign in to view your account</h1>
                  <Link to='/login'>Login</Link>
            </div>
      )

        return (
            <div className={styles.account}>
              <div className={styles.sidebar}>
                <ul className={styles.accountList}>
                  <li className={`${styles.option} ${selectedOption === 'profile' ? styles.active : ''}`} onClick={() => handleOptionClick('profile')}>
                  Profile
                  </li>
                  <li className={`${styles.option} ${selectedOption === 'posts' ? styles.active : ''}`} onClick={() => handleOptionClick('posts')}>
                  Posts
                  </li>
                  <li className={`${styles.option} ${selectedOption === 'comments' ? styles.active : ''}`} onClick={() => handleOptionClick('comments')}>
                  Comments
                  </li>
                  <li className={`${styles.option} ${selectedOption === 'saved' ? styles.active : ''}`} onClick={() => handleOptionClick('saved')}>
                  Saved
                  </li>
                </ul>
              </div>

              <div className={styles.content}>
                {selectedOption === 'profile' && (
                  <div className={styles.profile}>
                        <div className={styles.details}>
                              <p><span>Name:</span> {user.user_metadata.full_name}</p>
                              <p><span>Email:</span> {user.email}</p>
                              <p><span>Joined:</span> {moment(user?.created_at).format('MMMM D, YYYY')}</p>
                              <button onClick={handleLogout}>Sign Out</button>
                        </div>
                  </div>
                )}

                {selectedOption === 'posts' && (
                  <div className={styles.posts}>
                        <p className={styles.postCount}>Total: <span>{posts.length}</span> posts</p>
                        <div className={styles.details}>
                              {posts.map((post) => (
                                    <div className={styles.postList} key={post.id}>
                                          <h4>{moment(post.created_at).format('MMMM D, YYYY')}</h4>
                                          <p>{post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content} <Link className={styles['read-more']} style={{color:'black'}} to={`/post/${post.id}`}>More
                                    </Link></p>
                                          <Link style={{textDecoration: 'none', color: 'white'}} to={`/post/${post.id}`}><button className={styles.viewBtn}> View Post </button></Link>
                                    </div>
                              ))}
                        </div>    
                  </div>
                )}

            {selectedOption === 'comments' && (
                  <div className={styles.comments}>
                        <div className={styles.details}>
                        <p className={styles.commentCount}>Total: <span>{comments.length}</span> comments</p>
                              {comments.map((comment) => (
                                    <div className={styles.commentList} key={comment.id}>
                                          <h4>{moment(comment.created_at).format('MMMM D, YYYY')}</h4>
                                          <p>{comment.comment_content.length > 100 ? comment.comment_content.substring(0, 100) + '...' : comment.comment_content}</p>
                                          <Link style={{textDecoration: 'none', color: 'white'}} to={`/post/${comment.post_id}`}><button className={styles.viewBtn}> View Comment </button></Link>
                                    </div>
                              ))}
                        </div>  
                  </div>
                )}

                {selectedOption === 'saved' && (
                  <div className={styles.saved}>
                        <p className={styles.postCount}>Total: <span>{savedPosts.length}</span> saved posts</p>
                        <div className={styles.details}>
                              {savedPosts.map((savedPost) => (
                                    <div className={styles.postList} key={savedPost.id}>
                                          <h2>{savedPost.title}</h2>
                                          <p>{savedPost.content.length > 100 ? savedPost.content.substring(0, 100) + '...' : savedPost.content} <Link className={styles['read-more']} style={{color:'black'}} to={`/post/${savedPost.id}`}>More
                                    </Link></p>
                                          <Link style={{textDecoration: 'none', color: 'white'}} to={`/post/${savedPost.id}`}><button className={styles.viewBtn}> View Post </button></Link>
                                    </div>
                              ))}
                        </div>
                  </div>
                  )}
              </div>
            </div>
)};
        export default Account;