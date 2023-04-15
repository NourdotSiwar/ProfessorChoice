import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import './styles/ReadComments.css'
import EditComment from './EditComment';

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
          <EditComment key={comment.comment_id} token={token} comment={comment} 
          postId={postId} />
        ))}
      </div>
      );
      }

      export default ReadComments;