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

                  setComments(data)
            }
      }

            fetchComments().catch(console.error);
      }, [user])   

      if (!user) {
            return <div>Loading...</div>
      }


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
                </ul>
              </div>

              <div className={styles.content}>
                {selectedOption === 'profile' && (
                  <div className={styles.profile}>
                        <div className={styles.details}>
                              <p><span>Name:</span> {user.user_metadata.full_name}</p>
                              <p><span>Email:</span> {user.email}</p>
                              <p><span>Joined:</span> {moment(user.created_at).format('MMMM D, YYYY')}</p>
                              <button onClick={handleLogout}>Sign Out</button>
                        </div>
                  </div>
                )}

                {selectedOption === 'comments' && (
                  <div className={styles.comments}>
                        <div className={styles.details}>
                        <p className={styles.commentCount}>Total: <span>{comments.length}</span> comments</p>
                              {comments.map((comment) => (
                                    <div className={styles.commentList} key={comment.id}>
                                          <p>{moment(comment.created_at).format('MMMM D, YYYY')}</p>
                                          <p>{comment.comment_content}</p>
                                          <Link style={{textDecoration: 'none', color: 'white'}} to={`/post/${comment.post_id}`}><button className={styles.viewBtn}> View Comment </button></Link>
                                    </div>
                              ))}
                        </div>  
                  </div>
                )}

                {selectedOption === 'posts' && (
                  <div className={styles.posts}>
                        <p className={styles.postCount}>Total: <span>{posts.length}</span> posts</p>
                        <div className={styles.details}>
                              {posts.map((post) => (
                                    <div className={styles.postList} key={post.id}>
                                          <p>{moment(post.created_at).format('MMMM D, YYYY')}</p>
                                          <p>{post.content}</p>
                                          <Link style={{textDecoration: 'none', color: 'white'}} to={`/post/${post.id}`}><button className={styles.viewBtn}> View Post </button></Link>
                                    </div>
                              ))}
                        </div>    
                  </div>
                )}

              </div>
            </div>
)};
        export default Account;