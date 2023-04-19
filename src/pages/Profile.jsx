import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../client";
import moment from "moment";
import styles from "./styles/Profile.module.css";
import { CgProfile } from "react-icons/cg";
import { MdPostAdd } from "react-icons/md";
import { AiOutlineComment } from "react-icons/ai";
import { Link } from "react-router-dom";


const Profile = () => {
      const { user_id } = useParams();
      const [user, setUser] = useState(null);
      const [posts, setPosts] = useState([])
      const [comments, setComments] = useState([])
      const [selectedOption, setSelectedOption] = useState('profile');

      useEffect(() => {
            if (user_id) {
            const fetchUser = async () => {
                  const { data, error } = await supabase
                        .from("users")
                        .select("*")
                        .eq("id", user_id)
                        .single();
                  if (error) console.log('error fetching user data:', error);
                   else {
                        setUser(data);
                  }
            }
            fetchUser().catch(console.error);
            }
      }, [user_id]);


      useEffect(() => {
            if (user_id) {
            const fetchPosts = async () => {
                  const { data, error } = await supabase
                        .from("posts")
                        .select("*")
                        .eq("user_id", user_id)
                        .order("created_at", { ascending: false });
                  if (error) console.log('error fetching user data:', error);
                        else {
                        setPosts(data);
                  }
            }
            fetchPosts().catch(console.error);
            }
      }, [user_id]);

      useEffect(() => {
            if (user_id) {
            const fetchComments = async () => {
                  const { data, error } = await supabase
                        .from("comments")
                        .select("*")
                        .eq("user_id", user_id)
                        .order("created_at", { ascending: false });

                  if (error) console.log('error fetching user data:', error);
                        else {
                        setComments(data);
                  }
            }
            fetchComments().catch(console.error);
            }
      }, [user_id]);

      const handleOptionClick = (option) => {
            setSelectedOption(option);
      }



      return (
   
<div className={styles.account}>

            <div className={styles.sidebar}>
            <ul className={styles.accountList}>
            <li className={`${styles.option} ${selectedOption === 'profile' ? styles.active : ''}`} onClick={() => handleOptionClick('profile')}>
            <span><CgProfile/></span> Profile
            </li>
            <li className={`${styles.option} ${selectedOption === 'posts' ? styles.active : ''}`} onClick={() => handleOptionClick('posts')}>
            <span><MdPostAdd/></span>Posts
            </li>
            <li className={`${styles.option} ${selectedOption === 'comments' ? styles.active : ''}`} onClick={() => handleOptionClick('comments')}>
            <span><AiOutlineComment/></span>Comments
            </li>
            </ul>
            </div>

<div className={styles.content}>
  {selectedOption === 'profile' && (
    <div className={styles.profile}>
          <div className={styles.details}> 
            <p><span>Username:</span> {user?.username}</p>
            <p><span>Joined:</span> {moment(user?.created_at).format('MMMM D, YYYY')}</p> 
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

</div>
</div>
      );
};

export default Profile;