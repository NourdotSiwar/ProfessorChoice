import React, { useEffect, useState} from 'react';
import {supabase} from '../client';
import styles from './styles/CreateComment.module.css';


const CreateComment = ({postId}) => {

      const [comment, setComment] = useState('');
      const [user, setUser] = React.useState(null);
      
      useEffect(() => {
            const session = supabase.auth.session;
            setUser(session?.user ?? null);
    
            const {
                data: authListener,
            }  = supabase.auth.onAuthStateChange(async (event, session) => {
                setUser(session?.user ?? null); });
    
            return () => {
                authListener.unsubscribe;
            };
        }, [supabase]);
        
        const createComment = async (event) => {
              event.preventDefault();
            await supabase
            .from('Users')
            .select('id')
            .eq('email', user.email)
            .single();

            const user_id = user.id;
      
            const { data: comment_data, error: comment_error } = await supabase
            .from('comments')
            .insert({
              comment_content: comment,
              user_id: user_id,
              post_id: postId
            })
            .single();
    
          if (comment_error) {
            console.log('Error inserting comment:', comment_error);
          } else {
            console.log('Comment inserted successfully:', comment_data);
            setComment('');
          }
          window.location.href = `/post/${postId}`;
      };
      

      return (
            <div className={styles.createComment}>
              <input
                type="text"
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <input type="submit" value="Submit" onClick={createComment} />
            </div>
          );
        };



      export default CreateComment;