import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useParams } from 'react-router-dom';
import './styles/EditComment.css';

const EditComment = ({postId}) => {

      const {id} = useParams();
      const [comment, setComment] = useState(null);

      useEffect(() => {
            const fetchComment = async () => {
                  const { data } = await supabase
                  .from('comments')
                  .select()
                  .eq('comment_id', id)

                  setComment(data[0]);
                  
            }
            fetchComment().catch(console.error);
      }, [id]);

      const updateComment = async (e) => {
            e.preventDefault();

            postId = comment.post_id;

            await supabase
            .from('comments')
            .update({ comment_content: comment.comment_content })
            .eq('comment_id', id)

            console.log(postId);
            window.location.href = `/post/${postId}`;
      }


      const deleteComment = async (e) => {
            e.preventDefault();

            await supabase
            .from('comments')
            .delete()
            .eq('comment_id', id)

            window.location.href = `/post/${postId}`;
      }

      if (!comment) {
            return <div>Loading...</div>
      }

      return (

            <div className='edit-comment'>
                  <h1>Edit Comment</h1>
                  <form onSubmit={updateComment}>
                        <div className='form-group'>
                              <label htmlFor='comment'>Comment</label>
                              <textarea
                                    className='form-control'
                                    id='comment'
                                    rows='3'
                                    value={comment.comment_content}
                                    onChange={(e) => setComment({ ...comment, comment_content: e.target.value })}
                              ></textarea>
                        </div>
                        <button type='submit' className='btn btn-primary'>
                              Update
                        </button>
                        <button type='submit' className='btn btn-danger' onClick={deleteComment}>
                              Delete
                        </button>
                  </form>
            </div>
      );
      };

      export default EditComment;