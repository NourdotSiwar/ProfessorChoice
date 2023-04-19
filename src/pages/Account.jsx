import React, { useState, useEffect } from 'react'
import { supabase } from '../client'
import styles from './styles/Account.module.css';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { MdPostAdd } from 'react-icons/md';
import { AiOutlineComment } from 'react-icons/ai';
import { BsBookmarkCheckFill } from 'react-icons/bs';
import { SiGooglemessages } from 'react-icons/si';
import Chat from '../components/Chat';


const Account = ({token}) => {
      const [user, setUser] = useState(null)
      const [posts, setPosts] = useState([])
      const [comments, setComments] = useState([])
      const [selectedOption, setSelectedOption] = useState('profile');
      const [savedPosts, setSavedPosts] = useState([]);
      const [editUsername, setEditUsername] = useState(false);
      const [newUsername, setNewUsername] = useState('');
      
      const handleOptionClick = (option) => {
            setSelectedOption(option);
      };

      // fetch username, fullname, and email from users table
      useEffect(() => {
            const fetchUser = async () => {
                  const { data, error } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', token.user.id)
                  .single();

                  if (error) console.log('error fetching user:', error)
                  else {
                        setUser(data);
                        //console.log(data)
                  }
            }

            fetchUser().catch(console.error);
      }, [token.user.id])
          
      

      useEffect(() => {
            const fetchUserData = async () => {
                  if(user) {
                  const { data, error } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', user.id)
                  .maybeSingle();

                  if (error) console.log('error fetching user data:', error)
                  else {
                        setUser(data);
                  }

            }
      }
            fetchUserData().catch(console.error);
      }, [user])



      useEffect(() => {
            const fetchPosts = async () => {
              if (user) {
                const { data } = await supabase
                  .from('posts')
                  .select('*')
                  .eq('user_id', user.id)
                  .order('created_at', { ascending: false })
          
                setPosts(data)
                console.log(data)
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
<<<<<<< HEAD
      }, [user]) 
      
      const updateUsername = async () => {
            const { error } = await supabase
            .from('users')
            .update({ username: newUsername })
            .eq('id', token.user.id)

            if (error) console.log('error updating username:', error)
            else {
                  setUser({ ...user, username: newUsername });
                  setNewUsername('');
=======
      }, [user])     
      
      const updateUsername = async () => {
            const { data, error } = await supabase
            .from('users')
            .update({ username: newUsername })
            .eq('id', user.id)
            .single();

            if (error) console.log('error updating username:', error)
            else {
                  setUser(data);
>>>>>>> 72e85c056f0cb217e3508ab824683535961a358a
            }
      }

      const handleEditClick = () => {
            setEditUsername(true);
      }

      const handleUpdateClick = () => {
            setEditUsername(false);
            updateUsername();
      }

<<<<<<< HEAD
      const handleLogout = () => {
            sessionStorage.removeItem('token');
            window.location.reload();
      }

=======
>>>>>>> 72e85c056f0cb217e3508ab824683535961a358a
 return (
            <div className={styles.account}>
              <div className={styles.sidebar}>
                <ul className={styles.accountList}>
                  <li className={`${styles.option} ${selectedOption === 'profile' ? styles.active : ''}`} onClick={() => handleOptionClick('profile')}>
                  <span><CgProfile/></span> Profile
                  </li>
                  <li
                  className={`${styles.option} ${selectedOption === 'chats' ? styles.active : ''}`}
                  onClick={() => handleOptionClick('chats')}>
                  <span><SiGooglemessages/></span> Chats
                  </li>
                  <li className={`${styles.option} ${selectedOption === 'posts' ? styles.active : ''}`} onClick={() => handleOptionClick('posts')}>
                  <span><MdPostAdd/></span>Posts
                  </li>
                  <li className={`${styles.option} ${selectedOption === 'comments' ? styles.active : ''}`} onClick={() => handleOptionClick('comments')}>
                  <span><AiOutlineComment/></span>Comments
                  </li>
                  <li className={`${styles.option} ${selectedOption === 'saved' ? styles.active : ''}`} onClick={() => handleOptionClick('saved')}>
                  <span><BsBookmarkCheckFill/></span>Saved
                  </li>
                </ul>
              </div>

              <div className={styles.content}>
                {selectedOption === 'profile' && (
                  <div className={styles.profile}>
                        <div className={styles.details}>
<<<<<<< HEAD
                              <div className={styles.loginInfo}>
                              <p><span>Username:</span> {user?.username}</p>
                              <p><span>Full Name:</span> {user?.fullname}</p>
                              <p><span>Email:</span> {user?.email}</p>
                              <p><span>Joined:</span> {moment(token.user.created_at).format('MMMM D, YYYY')}</p>
                              </div>

                              <div className={styles.editUsername}>
                              {!editUsername && <button onClick={handleEditClick }>Update User</button>}
                              {editUsername &&(
                                    <>
                               <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
                               placeholder="Enter new username" /> <button onClick={handleUpdateClick}>Update</button>
                                    </>
                              )}
                              </div>
=======
                                 
                              <p><span>Username:</span> {user?.username}</p>
                              <p><span>Full Name:</span> {user?.fullname}</p>
                              <p><span>Email:</span> {user?.email}</p>
                              <p><span>Joined:</span> {moment(user?.created_at).format('MMMM D, YYYY')}</p>
>>>>>>> 72e85c056f0cb217e3508ab824683535961a358a
                              <button onClick={handleLogout}>Sign Out</button>

                              <div className={styles.editUsername}>
                              {!editUsername && <button onClick={handleEditClick }>Update User</button>}
                              {editUsername &&(
                                    <>
                               <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
                               placeholder="Enter new username" /> <button onClick={handleUpdateClick}>Update</button>
                                    </>
                              )}
                              </div>
                        </div>
                  </div>
                )}

                {selectedOption === 'posts' && (
                  <div className={styles.posts}>
                        <p style={{color:'white'}} className={styles.postCount}>Total: <span>{posts.length}</span> posts</p>
                        <div className={styles.details}>
                              {posts.map((post) => (
                                    <div className={styles.postList} key={post.id}>
                                          <h4>{moment(post.created_at).format('MMMM D, YYYY')}</h4>
                                          <p>{post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content} <Link className={styles['read-more']} style={{color:'teal'}} to={`/post/${post.id}`}>More
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
                        <p style={{color:'white'}}  className={styles.commentCount}>Total: <span>{comments.length}</span> comments</p>
                              {comments.map((comment, index) => (
                                    <div className={styles.commentList} key={index}>
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
                        <p style={{color:'white'}}  className={styles.postCount}>Total: <span>{savedPosts.length}</span> saved posts</p>
                        <div className={styles.details}>
                              {savedPosts.map((savedPost) => (
                                    <div className={styles.postList} key={savedPost.id}>
                                          <h2>{savedPost.title}</h2>
                                          <p>{savedPost.content.length > 100 ? savedPost.content.substring(0, 100) + '...' : savedPost.content} <Link className={styles['read-more']} style={{color:'teal'}} to={`/post/${savedPost.id}`}>More
                                    </Link></p>
                                          <Link style={{textDecoration: 'none', color: 'white'}} to={`/post/${savedPost.id}`}><button className={styles.viewBtn}> View Post </button></Link>
                                    </div>
                              ))}
                        </div>
                  </div>
                  )}

                  {selectedOption === 'chats' && (
                        <div className={styles.chats}>
                              <Chat />
                        </div>
                  )}
              </div>
            </div>
)};

export default Account;