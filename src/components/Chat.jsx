import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../client";
import styles from "./styles/Chat.module.css";

const Chat = () => {
      const [messages, setMessages] = useState([]);
      const [message, setMessage] = useState({content: ''});
      const {content} = message;
      const [user, setUser] = useState(null);
      const[conversations, setConversations] = useState([])
      const[selectedConversation, setSelectedConversation] = useState(null)
      const messagesEndRef = React.createRef()

      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, [messages])

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
        const { data, error } =
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
      };


      const handleConversationClick = async (otherUserId) => {
        setSelectedConversation(otherUserId);
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .or(`receiver_id.eq.${user.id}, sender_id.eq.${user.id}`)
          .or(`receiver_id.eq.${otherUserId}, sender_id.eq.${otherUserId}`)

          .order('created_at', { ascending: true })
        if (error) {
          console.log('error fetching messages:', error);
          console.log(otherUserId)
        } else {
          setMessages(messages);
        }
      };
        
        useEffect(() => {
          const fetchConversations = async () => {
            if (user) {
              const { data: conversations, error } = await supabase
                .from('users')
                .select('id, username')
                .neq('id', user.id);
        
              if (error) {
                console.log('error fetching conversations:', error);
              } else {
                const newConversations = [];
                for (const conversation of conversations) {
                  const { data: messages, error } = await supabase
                    .from('messages')
                    .select('*')
                    .or(`receiver_id.eq.${user.id}, sender_id.eq.${user.id}`)
                    .or(`receiver_id.eq.${conversation.id}, sender_id.eq.${conversation.id}`)
                    .order('created_at', { ascending: false })
        
                  if (error) {
                    console.log('error fetching messages:', error);
                  } else {
                    const lastMessage = messages[0];
                    if (lastMessage) {
                      const otherUser = conversation.username;
                      const conversationWithLastMessage = {
                        ...lastMessage,
                        otherUser,
                      };
                      newConversations.push(conversationWithLastMessage);
                    }
                  }
                }
                setConversations(newConversations);
              }
            }
          };
          fetchConversations().catch(console.error);
        }, [user]);
        

      return (
        <div className={styles.chatDiv}>
          <div className={styles.sideChats}>
            <div className={styles.conversations}>
              {conversations.map((conversation) => (
                <div className={styles.conversationDiv}>
                    <div
                      className={styles.conversation}
                      onClick={() => handleConversationClick(
                        conversation.receiver_id
                      )}>
                        <p>{conversation.otherUser}</p>
                        </div>
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
                    <div ref={messagesEndRef} />
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