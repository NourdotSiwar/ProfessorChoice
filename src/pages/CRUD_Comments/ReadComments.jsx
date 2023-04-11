import React, { useState, useEffect } from 'react';
import { supabase } from '../../client';
import '../styles/ReadComments.css'
import { Link } from 'react-router-dom';

const ReadComments = ({ token, postId }) => {

      const [comments, setComments] = useState([]);
  

      useEffect(() => {
        const fetchComments = async () => {
          const { data } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: false });

          setComments(data);
        };
        fetchComments().catch(console.error);
      }, [postId]);

      if (!comments) {
        return <div>Loading...</div>;
      }

      return (

            <div className='comments'>
            {comments.map((comment) => (
              <div className='comment' key={comment.comment_id}>
                <div className='comment-header'>
                  <div className='comment-info'>
                  <p>{new Date(comment.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, {new Date(comment.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                     
                    <div className='comment-actions'>
                     { comment.user_id === token.user.id && 
                        <Link to={`/editComment/${comment.comment_id}`}>
                          <button className='edit-comment'>Edit</button>
                        </Link>
                     }

                       </div>

                  </div>
                </div>
                <div className='comment-body'>
                  <p>{comment.comment_content}</p>
                </div>
              </div>
            ))}
          </div>
          

      );
      }

      export default ReadComments;