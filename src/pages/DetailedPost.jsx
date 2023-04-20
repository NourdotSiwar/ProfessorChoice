import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {supabase} from '../client';
import styles from './styles/DetailedPost.module.css';
import ReadComments from './ReadComments';
import CreateComment from './CreateComment';
import Loading from '../components/Loading';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { HiOutlinePencil } from 'react-icons/hi';
import { BiUpvote } from 'react-icons/bi';
import { BsBookmark } from 'react-icons/bs';
import { BsBookmarkFill } from 'react-icons/bs';
import { MdOutlineArrowBack } from 'react-icons/md';
import Report from '../components/Report';

const DetailedPost = ( {token}) => {

      let params = useParams();
      const [post, setPost] = useState([]);
      const postId = params.id;
      const [upvotes, setUpvotes] = useState({});
      const [loading, setLoading] = useState(false);
      const [isSaved, setIsSaved] = useState(false);
      const [savedPosts, setSavedPosts] = useState([]);
      const [currentPostId, setCurrentPostId] = useState(null);

      useEffect(() => {
            const fetchPost = async () => {
                  setLoading(true);
                  setTimeout(async () => {
                  const { data, error } = await supabase
                  .from('posts')
                  .select('*')
                  .eq('id', postId)
                  .maybeSingle();
                  setPost(data);
                  setLoading(false);

                  if (error) {
                        console.log('Error fetching post:', error);
                  }
                  
                //  console.log(postId);
            }, 0);
            }
            fetchPost().catch(console.error);
      }, [postId]);

      useEffect(() => {
            const fetchUpvotes = async () => {
                  const { data, error } = await supabase
                  .from('posts')
                  .select('id, upvotes');
                  
                  if (error) {
                        console.log('Error fetching upvotes:', error);
                  } else {
                        const voteCount = data.reduce((acc, post) => {
                              acc[post.id] = post.upvotes;
                              return acc;
                        }, {});
                        setUpvotes(voteCount);
                  }
            }

            fetchUpvotes().catch(console.error);
      }, []);

      const updateUpvote = async (postId) => {

            const { error } = await supabase
            .from('posts')
            .update({ upvotes: (upvotes[postId] || 0) + 1 })
            .eq('id', postId)

            if(error) console.log('error updating upvote:', error)
            else {
                  const { data } = await supabase
                  .from('posts')
                  .select('*')
                  .eq('id', postId)
                  .maybeSingle();

                  setPost({ ...post, ...data });
                  setUpvotes({ ...upvotes, [postId]: data.upvotes });
            }
        }

      const bookmarkPost = async (postId) => {
            const { data:savedPost, error } = await supabase
            .from('saved_posts')
            .select('*')
            .eq('user_id', token.user.id)
            .eq('post_id', postId)
            .maybeSingle();

            if (error) {
                  console.log('Error fetching saved post:', error);
            }

            if (savedPost) {
                  // post is already saved so delete row
                  const { error: deleteError } = await supabase
                  .from('saved_posts')
                  .delete()
                  .eq('id', savedPost.id)
                  .single();
                  
                  if (deleteError) {
                        console.log('Error deleting saved post:', deleteError);
                  } else {
                        setIsSaved(false);
                  }

            } else {

                  // post isnt saved so insert new row
                  const { error: insertError } = await supabase
                  .from('saved_posts')
                  .insert({
                        user_id: token.user.id,
                        post_id: postId
                  })
                  .single();

                  if (insertError) {
                        console.log('Error inserting saved post:', insertError);
                  } else {
                        setIsSaved(true);
                  }

            }
      }

      useEffect(() => {
            const fetchUsername = async () => {
                  if(!post.user_id) return;
                  const { data: user, error } = await supabase
                  .from('users')
                  .select('username')
                  .eq('id', post.user_id)
                  .maybeSingle();

                  if (error) {
                        console.log('Error fetching username:', error);
                  } else {
                        setPost({ ...post, username: user.username });
                       // console.log(post.user_id);
                  }
            }

            fetchUsername().catch(console.error);
      }, [post.user_id]);

      useEffect(() => {
            const fetchSavedPosts = async () => {

            if (!token) {
                  return; }

              const { data: savedPosts, error } = await supabase
                .from('saved_posts')
                .select('post_id')
                .eq('user_id', token.user?.id);
          
              if (error) {
                console.log('Error fetching saved posts:', error);
              } else {
                setSavedPosts(savedPosts.map((savedPost) => savedPost.post_id));
               // console.log(token)
              }
            };
          
            fetchSavedPosts();
          }, [token]);
          
      useEffect(() => {     
      setIsSaved(savedPosts.includes(currentPostId));
     // console.log(savedPosts, currentPostId);
      }, [savedPosts, currentPostId]);

      useEffect(() => {
            setCurrentPostId(post?.id);
            console.log(post);
      }, [post]);

      return (
      
            <div className={styles.postContainer}>
                  {loading && <Loading />}
                  {!loading && post?.title && (
                        <>
                  <div className={styles.detailedPost}>
                  <div className={styles.backBtn}
                  onClick={() => window.history.back()}> <MdOutlineArrowBack/> </div>
                  <div className={styles.postHeader}>
                  <p className={styles.postTime}>Posted {moment(post.created_at).fromNow()}</p>
                  
                  <div className={styles.actions}>
                  {post.user_id === token.user.id &&
                  <Link style={{textDecoration:'none'}} to={`/edit/${post.id}`}><button className={styles.editBtn}><HiOutlinePencil/></button> </Link>}
                  <button onClick={() => bookmarkPost(post.id)} className={styles.bookmarkBtn}
                  >{isSaved ? <BsBookmarkFill/> : <BsBookmark/>}</button>
                  <Report/>
                  </div>
                  </div>

                  <div className={`${styles.flair} ${post.flair === 'question' ? styles.questionFlair : styles.opinionFlair}`}>{post.flair}</div>
                  <h1  className={styles.postTitle}>{post.title}</h1>
                  {
                        post.user_id === token.user.id ? (
                              <p className={styles.postAuthor}>Posted by you</p>
                        ) : (
                              <p className={styles.postAuthor}>Posted by
                              <Link style={{textDecoration:'none'}} to={`/profile/${post.user_id}`}>
                              <span className={styles.postAuthorName}> {post.username}</span>
                              </Link>
                               </p>
                        )
                  }
                                   
                  <p className={styles.postContent}>{post.content}</p>

                  <div className={styles.upvoteCommentDiv}>
                  {post.user_id === token.user.id ? (
                  <button className={styles.upvoteBtn} disabled>
                  {post.upvotes || 0} <BiUpvote/>
                  </button>
                  ) : (
                  <button
                  className={styles.upvoteBtn}
                  onClick={() => updateUpvote(post.id)}
                  >
                  {post.upvotes} <BiUpvote/>
                  </button>
                  )}
                  <CreateComment token={token} postId={postId} />
                  </div>

                  <div className={styles.commentList}>
                  <ReadComments token={token} postId={postId} />
                  </div>


                  </div>
                  </>
                  )}
            </div>
            
      );
      };
      
      export default DetailedPost;