import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Report from '../components/Report';
import { MdDelete } from 'react-icons/md';
import { BiPencil } from 'react-icons/bi';
import { GiCancel } from 'react-icons/gi';
import { FaSave } from 'react-icons/fa';
import styles from './styles/EditComment.module.css';

const EditComment = ({postId, token, comment}) => {

      const {id} = useParams();
      const [editing, setEditing] = useState(false);
      const [editedComment, setEditedComment] = useState(comment.comment_content)
      const navigate = useNavigate();


      const handleEditClick = () => {
            setEditing(true);
      }

      const handleSaveClick = async () => {
            await supabase
            .from('comments')
            .update({ comment_content: editedComment })
            .eq('comment_id', comment.comment_id)

            window.location.reload();
            setEditing(false);
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
        
                // reload the page
                window.location.reload();
            }
          };

      return (
            <div className={styles.comment}>
            <div className={styles.commentHeader}>
              <div className={styles.commentInfo}>
                <p style={{fontWeight: 'bold'}}>Posted {moment(comment.created_at).fromNow()}</p>
                <div className={styles.commentActions}>
                {comment.user_id === token.user.id && (
                  <>
                    {!editing && <button onClick={handleEditClick}><BiPencil/></button>}
                    {editing && (
                      <>
                        <button onClick={handleSaveClick}><FaSave/></button>
                        <button onClick={handleCancelClick}><GiCancel/></button>
                      </>
                    )}
                    <button className={styles.trashBtn} onClick={handleDeleteClick}><MdDelete/></button>
                    </>
                )}
                <Report/>
                </div>
              </div>
            </div>
            <div className={styles.commentBody}>
              {!editing && <p>{comment.comment_content}</p>}
              {editing && (
                <textarea value={editedComment} onChange={handleInputChange} />
              )}
            </div>
          </div>
      );
      };

      export default EditComment;