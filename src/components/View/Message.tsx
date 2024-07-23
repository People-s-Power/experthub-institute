'use client'

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

interface User {
  _id: string;
  fullname: string;
  profilePicture?: string;
  email: string;
}

interface Message {
  to: string;
  from: string;
  type: string;
  created_at: number;
  text: string;
}

interface Chat {
  error: any;
  _id: string;
  participants: User[];
  messages: Message[];
}

interface SocketResponse {
  conversation_id: string;
  message: Message;
}

const socket = io('http://localhost:3001');
import { useAppSelector } from '@/store/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate } from '../modals/Notification';

const Message: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Chat | null>(null);
  const user = useAppSelector((state) => state.value);
  const [userId, setUserId] = useState<string>(user.id); // Replace with your user ID logic
  const toUserId = useSearchParams().get("id")
  const router = useRouter()

  useEffect(() => {
    // Receive chat history from server
    socket.emit('get_direct_conversations', { user_id: userId }, (existing_conversations: Chat[]) => {
      setConversations(existing_conversations.reverse());
    });

    // Receive new message from server
    socket.on('new_message', (data: SocketResponse) => {
      if (data.conversation_id === selectedConversation?._id) {
        setChatHistory((prevHistory) => [...prevHistory, data.message]);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('new_message');
    };
  }, [selectedConversation, userId]);

  useEffect(() => {
    if (toUserId) {
      startConversation(toUserId as string);
      router.push(user.role === "student" ? "/applicant/message" : user.role === "admin" ? '/admin/message' : "/tutor/message")
    }
  }, [toUserId]);

  const startConversation = (to: string) => {
    const from = userId;

    // Check if there is any existing conversation
    const existing_conversation = conversations.find(
      (conv) => conv.participants.length === 2 && conv.participants.some((p) => p._id === to)
    );

    if (!existing_conversation) {
      socket.emit('start_conversation', { to, from }, (new_chat: Chat) => {
        if (new_chat.error) {
          console.error(new_chat.error);
        } else {
          setSelectedConversation(new_chat);
          setChatHistory([]);
        }
      });
    } else {
      setSelectedConversation(existing_conversation);
      socket.emit('get_messages', { conversation_id: existing_conversation._id }, (messages: Message[]) => {
        setChatHistory(messages);
      });
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedConversation) {
      const newMessage = {
        from: userId,
        to: selectedConversation.participants.find((p) => p._id !== userId)?._id || '',
        type: 'Text',
        created_at: Date.now(),
        text: message,
        conversation_id: selectedConversation?._id
      };
      socket.emit('send_dm', newMessage);
      setChatHistory((prevHistory) => [...prevHistory, newMessage]);
      setMessage('');
    }
  };

  const handleConversationSelect = (conversation: Chat) => {
    setSelectedConversation(conversation);
    socket.emit('get_messages', { conversation_id: conversation._id }, (messages: Message[]) => {
      setChatHistory(messages);
    });
  };

  return (
    <div className='flex'>
      <div className='w-[35%] p-3 border-r border-[#15121233] h-[80vh] overflow-y-scroll'>
        {/* <h2>Conversations</h2> */}
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv._id}
              onClick={() => handleConversationSelect(conv)}
              className={`cursor-pointer p-2 ${selectedConversation?._id === conv._id ? 'bg-gray-300' : ''}`}
            >
              {conv.participants
                .filter((p) => p._id !== userId)
                .map((p) => (
                  <React.Fragment key={p._id}>
                    <div className='flex justify-between my-1'>
                      <div className='flex'>
                        <img src={p.profilePicture || '/images/user.png'} alt={p.fullname} className='w-10 h-10 rounded-full mr-2' />
                        <div className='ml-1'>
                          <p className='capitalize'>{p.fullname}</p>
                          <p className='text-xs'>{conv.messages[conv.messages.length - 1]?.text.substring(0, 10)}</p>
                        </div>
                      </div>
                      <p className='text-xs my-auto'>{formatDate(new Date(conv.messages[conv.messages.length - 1]?.created_at))}</p>
                    </div>
                  </React.Fragment>
                ))}
            </li>
          ))}
        </ul>
      </div>
      <div className='w-[65%] px-4 h-[80vh] overflow-y-scroll'>
        {/* <h2>Chat</h2> */}
        <div>
          <div className='flex-1'>
            {selectedConversation && (
              <ul>
                {chatHistory.map((msg, index) => (
                  <div key={index}>
                    {msg.from === userId ? <li className='w-1/2 my-1 bg-primary p-1 text-white rounded-md ml-auto'>{msg.text}</li> : <li className='w-1/2 my-1'>{msg.text}</li>}
                  </div>
                  // <li key={index}>
                  //   <strong>{msg.from === userId ? 'You' : 'Them'}:</strong> 
                  // </li>
                ))}
              </ul>
            )}
          </div>
          {toUserId || selectedConversation ? (
            <div className='p-4 fixed bottom-0 left-[50%] right-0'>
              <div className=''>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className='h-20  p-2 w-full'
                />
                <button onClick={handleSendMessage} className='border p-2 bg-primary text-white'>
                  Send
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Message;
