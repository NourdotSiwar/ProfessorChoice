import { useState, useEffect } from "react";
import { supabase } from "../client";
import styles from "./styles/Chat.module.css";

const Chat = () => {
      const [messages, setMessages] = useState([]);
      const [message, setMessage] = useState({username: '', content: ''});
      const {content } = message;
      const [user, setUser] = useState(null);
      const[conversations, setConversations] = useState([])
      const[selectedConversation, setSelectedConversation] = useState(null)



useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
              setUser(session?.user ?? null)
        })

        return () => {
              authListener.unsubscribe
        }
  }, [])

useEffect(() => {
    const fetchUserData = async () => {
          if(user) {
          const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

          if (error) console.log('error fetching user data:', error)
          else {
                setUser(data);
          }

    }
}
    fetchUserData().catch(console.error);
}, [user])


useEffect(() => {
        const profiles = supabase
        .channel('table-db-changes')
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {  
            payload &&
            setMessages((oldMessages) => [...oldMessages, payload.new])
          }
        )
        .subscribe()

        return () => {
          profiles.unsubscribe();
        };
      }, []);

      const createMessage = async () => {
        await supabase
        .from("messages")
        .insert([
          {
            content: content,
            sender_id: user.id,
            receiver_id: selectedConversation,
          },
        ])
        .single();

        setMessage({content: ''});
        console.log(messages);
      };  



      const handleConversationClick = async (otherUserId) => {
        setSelectedConversation(otherUserId)
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*') 
          // first OR statement is for when the current user is the sender
          .or(`receiver_id.eq.${user.id}, sender_id.eq.${user.id}`)

          // second OR statement is for when the current user is the receiver
          .or(`receiver_id.eq.${otherUserId}, sender_id.eq.${otherUserId}`)

          .order('created_at', {ascending: true})

      
          if (error) {
            console.log('error fetching messages:', error);
          } else {
            setMessages(messages);
            console.log('selected')
            console.log(
              "sender_id:" + user.username + " receiver_id:" + otherUserId
            )
          }
        };
        

      // make a fetch conversations function 
      useEffect(() => {
        const fetchConversations = async () => {
          if(user) {
            const {data:conversationsData, error} = await supabase
            .from('users')
            .select('*')
            .neq('id', user.id)

            if(error) console.log('error fetching conversations:', error)
            else {
              setConversations(conversationsData)
              
            }
          }
        }

        fetchConversations().catch(console.error)
      }, [user])
     
      return (
        <div className={styles.chatDiv}>
          <div className={styles.sideChats}>
            <div className={styles.conversations}>
              {conversations.map((conversation) => (
                <div className={styles.conversationDiv}>
                    <div
                      className={styles.conversation}
                      onClick={() => handleConversationClick(conversation.id)}> {conversation.username}</div>
                </div>
              ))}
            </div>
            </div>

            <div className={styles.container}>
              <div className={styles.separator}>
                {messages?.map((message) => (
                  <div className={styles.contentMsg} key={message.id}>
                    {message.sender_id === user.id ? (
                      <div className={styles.contentRight}>
                        <p className={styles.textRight}>{message.content}</p>
                      </div>
                    ) : (
                      <div className={styles.contentLeft}>
                        <p className={styles.textLeft}>{message.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.input}>
                <input
                  type="text"
                  placeholder="Type a message"
                  value={content}
                  onChange={(e) => setMessage({content: e.target.value})}
                  />
                  <button onClick={createMessage}>Send</button>
                </div>
              </div>
            </div>
    );          
};

export default Chat;