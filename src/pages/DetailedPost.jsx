import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {supabase} from '../client';
import styles from './styles/DetailedPost.module.css';
import ReadComments from './ReadComments';
import CreateComment from './CreateComment';
import Loading from '../components/Loading';
import moment from 'moment';
import { Link } from 'react-router-dom';

const DetailedPost = ( {token}) => {

      let params = useParams();
      const [post, setPost] = useState([]);
      const postId = params.id;
      const [upvotes, setUpvotes] = useState({});
      const [loading, setLoading] = useState(false);

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
            }, 0);
            }

            fetchPost().catch(console.error);
      }, [postId]);

      const updateUpvote = async (postId) => {

            const { error } = await supabase
            .from('posts')
            .update({ upvotes: (upvotes[postId] || 0) + 1 })
            .eq('id', postId)

            if(error) console.log('error updating upvote:', error)
            else {
                  const { data, error } = await supabase
                  .from('posts')
                  .select('*')
                  .eq('id', postId)
                  .maybeSingle();

                  setPost(data);
                  setUpvotes({ ...upvotes, [postId]: data.upvotes });

            }

        }

      return (
      
            <div className={styles.postContainer}>
                  {loading && <Loading />}
                  {!loading && post.title && (
                        <>
                  <div className={styles.detailedPost}>
                  <div className={styles.postHeader}>
                  <p className={styles.postTime}>{moment(post.created_at).fromNow()}</p>
                  <p className={`${styles.flair} ${post.flair === 'question' ? styles.questionFlair : styles.opinionFlair}`}>{post.flair}</p>
                  {post.user_id === token.user.id &&
                    <Link to={`/edit/${post.id}`}><button className={styles.editBtn}>Edit</button> </Link>}
                  </div>
                  <h1  className={styles.postTitle}>{post.title}</h1>
                  <p className={styles.postContent}>{post.content}</p>

                  <div className={styles.upvoteCommentDiv}>
                  {post.user_id === token.user.id ? (
                  <button className={styles.upvotesBtnSmall} disabled>
                  {post.upvotes || 0} △
                  </button>
                  ) : (
                  <button
                  className={styles.upvotesBtnSmall}
                  onClick={() => updateUpvote(post.id)}
                  >
                  {post.upvotes} ▲
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