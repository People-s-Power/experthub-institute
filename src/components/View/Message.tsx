'use client'

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

interface User {
  _id: string;
  fullname: string;
  profilePicture?: string;
  email: string;
}

interface Message {
  file: string | undefined;
  to: string;
  from: string;
  type: string;
  created_at: number;
  text: string;
}

interface Chat {
  blocked: any;
  error: any;
  _id: string;
  participants: User[];
  messages: Message[];
}

interface SocketResponse {
  conversation_id: string;
  message: Message;
}

const socket = io('https://seashell-app-nejbh.ondigitalocean.app/');
import { useAppSelector } from '@/store/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate } from '../modals/Notification';
import Link from 'next/link';
import AppointmentModal from '../modals/AppointmentModal';
import { isActionChecked } from '@/utils/checkPrivilege';

const Message: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[] | any>([]);
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Chat | null>(null);
  const user = useAppSelector((state) => state.value);
  const [userId, setUserId] = useState<string>(user.id); // Replace with your user ID logic
  const toUserId = useSearchParams().get("id")
  const router = useRouter()
  const uploadRef = useRef<HTMLInputElement>(null)
  const [filesPreview, setFilePreview] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [editedText, setEditedText] = useState<any>("")
  const [messageToEdit, setMessagetoEdit] = useState<any>(0)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout ref for typing indication
  const [typingUser, setTypingUser] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [messageToDeleteIndex, setMessageToDeleteIndex] = useState<number | null>(null);
  const chatContainerRef = useRef<any>(null);
  const lastScrollTop = useRef<number>(0); // Store the last scroll position

  if (!isActionChecked('Respond to Chats', user.privileges)) return <p className='p-4'>You don't have the permission to respond to chats</p>

  useEffect(() => {
    // Receive chat history from server
    socket.emit('get_direct_conversations', { user_id: userId }, (existing_conversations: Chat[]) => {
      console.log(existing_conversations)
      setConversations(existing_conversations.reverse());
    });

    // Receive new message from server
    socket.on('new_message', (data: SocketResponse) => {
      if (data.conversation_id === selectedConversation?._id) {
        setChatHistory((prevHistory: any) => [...prevHistory, data.message]);
      }
    });

    socket.on('user_typing', (data) => {
      if (data.conversation_id === selectedConversation?._id) {
        setIsTyping(true);
        setTypingUser(data.user_fullname); // Capture the user who's typing
      }
    });

    socket.on('user_stopped_typing', (data) => {
      setIsTyping(false);
      setTypingUser(''); // Clear typing user when they stop typing
    });
    // Cleanup on unmount
    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
    };
  }, [selectedConversation, userId]);

  useEffect(() => {
    if (toUserId) {
      startConversation(toUserId as string);
      router.push(user.role === "student" ? "/applicant/message" : user.role === "admin" ? '/admin/message' : "/tutor/message")
    }
  }, [toUserId]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current && isTyping) {
        chatContainerRef.current.scroll({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth', // Add smooth scrolling effect
        });
      }
    };

    scrollToBottom();
  }, [chatHistory, isTyping]);


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

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    const reader = new FileReader()
    if (files && files.length > 0) {
      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          const type = files[0].name.substr(files[0].name.length - 3)
          sendFile(
            reader.result as string,
            checkFileType(type)
          )
          // setFilePreview({
          //   url: reader.result as string,
          //   type: type === "mp4" ? "Video" : "Image"
          // })
        }
      }
    }
  }

  const sendFile = (url: string, type: string) => {
    setLoading(true)
    console.log({ type, url })
    if (selectedConversation) {
      const newMessage = {
        from: userId,
        to: selectedConversation.participants.find((p) => p._id !== userId)?._id || '',
        type: type,
        created_at: Date.now(),
        file: url,
        conversation_id: selectedConversation?._id
      };
      socket.emit('send_dm', newMessage);
      setChatHistory((prevHistory: any) => [...prevHistory, newMessage]);
    }
    handleConversationSelect(selectedConversation)
    setLoading(false)
  }

  const DeleteMessage = (index: any) => {
    // Get the message to delete using the index
    const messageToDelete = chatHistory[index]

    // Make sure you have the conversation_id and message_id or the unique index
    const conversation_id = selectedConversation?._id; // This should be available in the component or passed as a prop
    const message_id = messageToDelete._id; // Assuming messages have a unique _id

    // Emit the 'delete_message' event through socket.io
    socket.emit('delete_message', {
      conversation_id,
      message_id,
      user_id: user.id
    });

    // Optionally update the UI to optimistically remove the message
    const updatedChatHistory = chatHistory.filter((_: any, i: number) => i !== index);
    setChatHistory(updatedChatHistory); // Assuming you use state for chatHistory
  };

  const handleSaveEdit = () => {
    const message = chatHistory[messageToEdit];

    const conversation_id = selectedConversation?._id; // Available in your component or passed as prop
    const message_id = message._id; // Assuming each message has a unique _id

    // Emit the 'edit_message' event through socket.io
    socket.emit('edit_message', {
      conversation_id,
      message_id,
      newText: editedText,
      user_id: user.id // The new text to update
    });

    // Optimistically update the UI
    const updatedChatHistory = chatHistory.map((msg: any, i: any) =>
      i === messageToEdit ? { ...msg, text: editedText } : msg
    );
    setChatHistory(updatedChatHistory);
    setEdit(false)
    setEditedText("")
    setMessagetoEdit(0)
    // Optionally, close the edit form here after saving
  };


  const blockMessage = () => {
    socket.emit('block_user', {
      by: user.id,
      conversation_id: selectedConversation?._id
    });
    setSelectedConversation(null)
  }

  const unblockMessage = (id: string) => {
    socket.emit('unblock_user', {
      by: user.id,
      conversation_id: id
    });
    setSelectedConversation(null)
  }

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
      setChatHistory((prevHistory: any) => [...prevHistory, newMessage]);
      setMessage('');
      setIsTyping(false);
      socket.emit('stop_typing', { conversation_id: selectedConversation?._id });
      setTypingUser('');
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    socket.emit('typing', { conversation_id: selectedConversation?._id, user_fullname: user.fullName });

    // Reset the typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to stop typing after a delay
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing', { conversation_id: selectedConversation?._id });
    }, 3000); // Typing indication lasts for 3 seconds
  };

  const markAllMessagesAsRead = () => {
    if (selectedConversation) {
      const chat_id = selectedConversation._id; // Change this to chat_id

      // Emit event to server to mark all messages as read
      socket.emit('mark_all_as_read', { chat_id, user_id: user.id });

      // Update local state to mark all messages as read
      setChatHistory((prevHistory: any[]) =>
        prevHistory.map((msg) => ({ ...msg, read: true }))
      );
    }
  };

  const handleConversationSelect = (conversation: Chat | any) => {
    setSelectedConversation(conversation);
    socket.emit('get_messages', { conversation_id: conversation._id }, (messages: Message[]) => {
      setChatHistory(messages);
    });
    markAllMessagesAsRead()
  };

  useEffect(() => {
    if (selectedConversation) {
      socket.emit('get_messages', { conversation_id: selectedConversation._id }, (messages: Message[]) => {
        setChatHistory(messages);
      });
    }
  })
  const handleDeleteMessage = (index: any) => {
    setMessageToDeleteIndex(index);
    setShowDeleteModal(true);
  };


  const handleConfirmDelete = () => {
    if (messageToDeleteIndex !== null) {
      DeleteMessage(messageToDeleteIndex)
      setShowDeleteModal(false); // Hide the modal after deletion
    }

  };
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className='flex flex-col lg:flex-row'>
      <div className='lg:w-[35%] w-full px-3 border-r border-[#15121233] lg:h-[80vh] overflow-y-scroll'>
        <p>{user.role === 'student' ? 'Instructors' : user.role === 'tutor' ? 'Students' : 'Instructors and Students'}</p>
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv._id}
              onClick={() => { conv.blocked.isBlocked === false ? handleConversationSelect(conv) : conv.blocked.isBlocked === true && conv.blocked.by === user.id ? handleConversationSelect(conv) : null }}
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
                          <p className='capitalize sm:text-sm'>{p.fullname}</p>
                          {conv.blocked.isBlocked ? conv.blocked.by === user.id ? <button onClick={() => unblockMessage(conv._id)} className='bg-[#808080] px-2 text-sm text-white rounded-full'>
                            Unblock
                          </button> : <button className='bg-[#808080] px-2 text-sm text-white rounded-full'>
                            blocked
                          </button> :
                            <p className='text-xs'>{conv.messages[conv.messages.length - 1]?.text === null ? 'Attachment' : conv.messages[conv.messages.length - 1]?.text.substring(0, 10)}</p>}
                        </div>
                      </div>
                      {conv.messages.length >= 1 && <p className='text-xs my-auto'>{formatDate(new Date(conv.messages[conv.messages.length - 1]?.created_at))}</p>}
                    </div>
                  </React.Fragment>
                ))}
            </li>
          ))}
        </ul>
      </div>
      <div ref={chatContainerRef} className={`lg:w-[65%] w-full p-4 lg:h-[60vh] sm:overflow-x-hidden overflow-y-scroll ${selectedConversation ? 'sm:fixed sm:top-[70px] sm:h-[100vh] sm:left-0 sm:bg-white' : 'sm:hidden'}`}>
        <div>

          <div className='flex-1'>
            {selectedConversation ? (
              <>
                <div className='flex'>
                  <button onClick={() => setSelectedConversation(null)} className='bg-primary rounded-full h-8 w-8 my-auto mr-4 p-2 lg:hidden sm:block text-white'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                    </svg>
                  </button>
                  {
                    selectedConversation.participants
                      .filter((p) => p._id !== userId)
                      .map((p) => (
                        <React.Fragment key={p._id}>
                          <div className='flex justify-between w-full my-1'>
                            <div className='flex'>
                              <img src={p.profilePicture || '/images/user.png'} alt={p.fullname} className='lg:w-10 lg:h-10 w-8 h-8 rounded-full mr-2' />
                              <div className='ml-1 my-auto'>
                                <p className='capitalize my-auto sm:text-sm'>{p.fullname}</p>
                              </div>
                            </div>
                            {
                              selectedConversation.blocked.isBlocked ?
                                <button onClick={() => unblockMessage(selectedConversation._id)} className='bg-primary p-1 rounded-md text-white px-3'>Unblock</button>
                                : <button onClick={() => blockMessage()} className='bg-[#FF0000] p-1 rounded-md text-white px-3'>Block</button>

                            }
                          </div>
                        </React.Fragment>
                      ))
                  }
                </div>

                <ul className="sm:mb-40">
                  {chatHistory.map((msg: {
                    read: any; from: string; text: string | React.ReactNode; type: string; file?: string;
                  }, index: React.Key | null | undefined) => (
                    <div key={index} className="relative group">
                      {msg.from === userId ? (
                        <li className="w-1/2 my-1 sm:text-sm bg-primary p-1 text-white rounded-md ml-auto relative">
                          {msg.text !== null ? msg.text : msg.type === 'Image' ? (
                            <img src={msg.file} alt="" />
                          ) : msg.type === 'Video' ? (
                            <video controls src={msg.file}></video>
                          ) : (
                            <div className="flex">
                              <span className="text-3xl mr-3">📁</span>
                              <a href={msg.file} download target="_blank" className="text-white my-auto">
                                Download
                              </a>
                            </div>
                          )}

                          {/* Edit & Delete Buttons (visible on hover) */}
                          {showDeleteModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                              <div className="bg-white p-6 rounded-md text-center">
                                <p className=' text-black'>Are you sure you want to delete this message?</p>
                                <div className="mt-4 flex justify-center space-x-4">
                                  <button onClick={handleCancelDelete} className="bg-primary text-white px-4 py-2 rounded-md">Cancel</button>
                                  <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="absolute top-1/2 -translate-y-1/2 right-2 hidden lg:group-hover:flex space-x-2">
                            {msg.type === 'Text' && <button
                              className="text-sm bg-blue-500 hover:bg-blue-600 p-1 rounded"
                              onClick={() => { setEdit(true), setMessagetoEdit(index), setEditedText(msg.text) }}
                            >
                              Edit
                            </button>}
                            <button
                              className="text-sm bg-red-500 hover:bg-red-600 p-1 rounded"
                              onClick={() => handleDeleteMessage(index)}
                            >
                              Delete
                            </button>
                          </div>
                          <p className='text-xs my-auto float-right z-10'>{msg.read ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#008000" className="bi bi-check2-all" viewBox="0 0 16 16">
                            <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0" />
                            <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708" />
                          </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                          </svg>}</p>
                        </li>
                      ) : (
                        <li className="w-1/2 my-1 sm:text-sm">
                          {msg.text !== null ? msg.text : msg.type === 'Image' ? (
                            <img src={msg.file} alt="" />
                          ) : msg.type === 'Video' ? (
                            <video controls src={msg.file}></video>
                          ) : (
                            <div className="flex">
                              <span className="text-3xl mr-3">📁</span>
                              <a href={msg.file} download target="_blank" className="my-auto">
                                Download
                              </a>
                            </div>
                          )}
                        </li>
                      )}
                    </div>
                  ))}
                  {isTyping && <p className="italic text-gray-500">{typingUser} is typing...</p>}
                </ul>

              </>
            ) : <div className='w-1/2 mx-auto text-center'>
              <img src="/images/unread.jpg" className='w-full mx-auto' alt="" />
              <p className='lg:text-lg'>Start having a conversation with your {user.role === 'student' ? 'Instructors' : user.role === 'tutor' ? 'Students' : 'Instructors and Students'}
              </p>
            </div>}
          </div>

          {edit ? <div className='p-4 fixed bottom-0 lg:left-[48%] left-0 right-0'>
            <textarea
              className='lg:h-20 h-10 p-2 w-full'
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <button className='bg-primary text-white p-2' onClick={handleSaveEdit}>Edit</button>
          </div> : toUserId || selectedConversation ? (
            selectedConversation?.blocked.isBlocked === false && <div className='p-4 fixed bg-white bottom-0 lg:left-[48%] left-0 right-0'>
              <div className='sm:flex sm:flex-col'>
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  className='lg:h-20 h-10 p-2 w-full'
                  placeholder='Write a message'
                />
                <div className='flex justify-between'>
                  <input type="file" ref={uploadRef} className="hidden" onChange={(e) => handleImage(e)} />

                  <div className='flex'>
                    <button onClick={() => uploadRef.current?.click()} className='p-2 rounded-full shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] w-10 h-10 bg-white flex justify-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi my-auto bi-paperclip" viewBox="0 0 16 16">
                        <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
                      </svg>
                    </button>

                    {/* <Link href={`/${user.role === 'student' ? 'applicant' : user.role}/appointment`}> */}
                    {user.role === 'student' && <button onClick={() => setOpen(true)} className='p-2 bg-white rounded-full shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] w-10 ml-4 h-10 flex justify-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-workspace my-auto" viewBox="0 0 16 16">
                        <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                        <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
                      </svg>
                    </button>}

                    {/* </Link> */}
                  </div>
                  <button onClick={handleSendMessage} className='mt-2 ml-3 lg:mt-0 border lg:p-2 p-1 bg-primary text-white'>
                    {loading ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <AppointmentModal to={selectedConversation?.participants[0]._id === userId ? selectedConversation?.participants[1]._id : selectedConversation?.participants[0]._id} open={open} handleClick={() => setOpen(false)} />
    </div>
  );
};

export default Message;


function checkFileType(fileName: string) {
  // Define extensions for each type
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];

  // Extract file extension from the file name
  const fileExtension: any = fileName.split('.').pop()?.toLowerCase();

  // Check file type based on the extension
  if (imageExtensions.includes(fileExtension)) {
    return 'Image';
  } else if (videoExtensions.includes(fileExtension)) {
    return 'Video';
  } else if (documentExtensions.includes(fileExtension)) {
    return 'Document';
  } else {
    return 'Unknown file type';
  }
}

