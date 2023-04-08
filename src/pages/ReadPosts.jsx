import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';


const readPosts = ({token}) => {

      let navigate = useNavigate();

      const handleLogout = () => {
            sessionStorage.removeItem('token');
            navigate('/login');
      }

      const [posts, setPosts] = React.useState([]);

      React.useEffect(() => {
            const fetchPosts = async () => {
                  const { data} 
                  = await supabase
                  .from('posts')
                  .select()
                  .order('created_at', { ascending: true });
                  setPosts(data);
            }
            fetchPosts().catch(console.error);
      }, []);
      
      return (
            <div>
                      <h3>welcome back, {token.user.user_metadata.full_name }</h3>
                      <button onClick={handleLogout}>Sign Out</button>

                          <h2>Posts</h2>  
                              <div className='posts-container'>
                                    {posts.map((post) => (
                                          <div className='post' key={post.id}>
                                                <h3>{post.title}</h3>
                                                <p>{post.content}</p>
                                          </div>
                                    ))}
                                    </div>
            </div>
      )
      }

export default readPosts;