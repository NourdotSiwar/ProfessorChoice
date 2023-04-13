import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {supabase} from '../client';
import './styles/DetailedPost.css';
import ReadComments from './ReadComments';
import CreateComment from './CreateComment';
import Loading from '../components/Loading';
import moment from 'moment';

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
      
            <div>
                  {loading && <Loading />}
                  {!loading && post.title && (
                        <>
                  <div className='detailed-post'>
                  <h1>{post.title}</h1>
                  <p>{post.content}</p>
                  <p>{moment(post.created_at).fromNow()}</p>

                  <div className='buttonDiv'>
                  { post.user_id === token.user.id ? (
                     <button className='upvotesBtn' disabled> {post.upvotes || 0} △</button>
                                          ) : (
                    <button className='upvotesBtn' onClick={() => updateUpvote(post.id)}>{post.upvotes} ▲</button>
                    )}

                  </div>

                  <div className='commentDiv' >
                        <div className='commentList'>
                              <ReadComments token={token} postId={postId} />
                              <CreateComment token={token} postId={postId} />
                              </div>     
                  </div>
                  </div>
                  </>
                  )}
            </div>
            
      );
      };
      
      export default DetailedPost;