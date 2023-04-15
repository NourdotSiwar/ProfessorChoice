import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useParams } from 'react-router-dom';
import './styles/EditComment.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const EditComment = ({postId, token, comment}) => {

      const {id} = useParams();
      const [editing, setEditing] = useState(false);
      const [editedComment, setEditedComment] = useState(comment.comment_content)
      const navigate = useNavigate();

      const onCommentUpdate = () => {
            window.location.reload();
            navigate(`/post/${postId}`);
      }

      useEffect(() => {
            const fetchComment = async () => {
                  const { data } = await supabase
                  .from('comments')
                  .select()
                  .eq('comment_id', id)

                  //setComment(data[0]);
                  
            }
            fetchComment().catch(console.error);
      }, [id]);

      const handleEditClick = () => {
            setEditing(true);
      }

      const handleSaveClick = async (e) => {
            e.preventDefault();
            await supabase
            .from('comments')
            .update({ comment_content: editedComment })
            .eq('comment_id', comment.comment_id)

            setEditing(false);
            onCommentUpdate();
      }

      const handleCancelClick = () => {
            setEditedComment(comment.comment_content);
            setEditing(false);
          };

      const handleInputChange = (event) => {
      setEditedComment(event.target.value);
      };


      const handleDeleteClick = async () => {
            if (window.confirm('Are you sure you want to delete this comment?')) {
              await supabase
                .from('comments')
                .delete()
                .eq('comment_id', comment.comment_id);
        
              onCommentUpdate();
            }
          };

      return (
            <div className='comment'>
            <div className='comment-header'>
              <div className='comment-info'>
                <p>Posted {moment(comment.created_at).fromNow()}</p>
                {comment.user_id === token.user.id && (
                  <div className='comment-actions'>
                    {!editing && <button onClick={handleEditClick}>Edit</button>}
                    {editing && (
                      <>
                        <button onClick={handleSaveClick}>Save</button>
                        <button onClick={handleCancelClick}>Cancel</button>
                      </>
                    )}
                    <button onClick={handleDeleteClick}>Delete</button>
                  </div>
                )}
              </div>
            </div>
            <div className='comment-body'>
              {!editing && <p>{comment.comment_content}</p>}
              {editing && (
                <textarea value={editedComment} onChange={handleInputChange} />
              )}
            </div>
          </div>
      );
      };

      export default EditComment;