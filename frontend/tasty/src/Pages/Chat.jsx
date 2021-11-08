import React, { useState, useEffect, useContext, useRef } from "react";
import chatsAPI from "../API/chats"
import MessageCard from "../Components/Message-Card";
import { ChatContext } from '../Contexts/chatContext';
import SendIcon from '@mui/icons-material/Send';
import ChatCard from "../Components/Chat-Card";
const io = require("socket.io-client");

const Chat = ({currentUser}) => {
    const [sendMessage, setSendMessage] = useState("")
    const [chat, setChat] = useState()
    const [chats, setChats] = useState()
    const [messages, setMessages] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [finished, setFinished] = useState(false)
    const [socket, setSocket] = useState()
    const {chatID, changeChatID} = useContext(ChatContext);
    const messagesRef = useRef(null)

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollIntoView(
            {
                behavior: 'auto',
                block: 'end',
                inline: 'nearest'
            })
        }
    }, [messages, loaded])

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chats = await chatsAPI.get(`/`);
    
                if (chatID === "") {
                    changeChatID(chats.data.data[0]._id)
                }
                setChats(chats.data.data)
            } catch (err) {}
        }
        fetchChats()
    }, [])

    useEffect(() => {
        if (chatID) {
            fetchData(new Date().toISOString())
        }
    }, [chatID])

    const fetchData = async (date) => {
        try {
            if (!chat || chatID !== chat._id) {
                const chat = await chatsAPI.get(`/${chatID}`);
                const loadMessages = await chatsAPI.get(`/${chatID}/messages?date=${date}`);

                loadMessages.data.data.reverse()

                if (loadMessages.data.data.length < 50) {
                    setFinished(true)
                } else {
                    setFinished(false)
                }

                setChat(chat.data.data)
                setMessages(loadMessages.data.data)
            } else {
                if (!finished) {
                    const loadMessages = await chatsAPI.get(`/${chatID}/messages?date=${date}`);

                    loadMessages.data.data.reverse()

                    if (loadMessages.data.data.length < 50) {
                        setFinished(true)
                    }

                    setMessages(previousState => [...loadMessages.data.data, ...previousState])
                }
            }
            setLoaded(true)
        } catch (err) {}
    }

    useEffect(() => {
        if (loaded) {
            const newSocket = io("https://tasty-env.eba-c5emmwpy.eu-west-2.elasticbeanstalk.com",
                {
                    query: {
                        id: chatID
                    },
                    withCredentials: true,
                    transports: ['websocket', 'polling', 'flashsocket']
                }
            );
            setSocket(newSocket)

            return () => newSocket.close()
        }   
    }, [chat, loaded])

    useEffect(() => {
        if (socket == null) return

        socket.on('receiveMessage', message => {
            setMessages(previousState => [...previousState, {messages: message}])
        })

        return () => socket.off(['receiveMessage'])
    }, [socket])

    const sendMessageForm = async (e) => {
        e.preventDefault();

        const newMessage = await chatsAPI.put(`/${chatID}`, {
            message: sendMessage
        })

        socket.emit('sendMessage', newMessage.data.data);

        setSendMessage("")
    }

    const loadMore = () => {
        if (messages.length !== 0) {
            fetchData(messages[0].messages.createdAt)
        }
    };

    return (
        <>
            {loaded &&
                <div className="chatBody"> 
                    <div className="chatList">
                        <p style={{marginTop: 0}} className="chatTitle text2">Recent chats</p>
                        <div className="chatListUsers">
                            {chats.map((chat, i) => {
                                return <ChatCard key={i} chat={chat} currentUser={currentUser} />
                            })}
                        </div>
                    </div>
                    <div className="chatMessages">
                        <div className="chatScroll">
                            <div className="chatContainer">
                                <div className="finishedMessages">
                                    {finished ?
                                        <p style={{marginBottom: 30}} className="text4">No more messages!</p>
                                        :
                                        <p style={{cursor: "pointer", textDecoration: "underline", marginBottom: 30}} className="text4" onClick={() => {loadMore()}}>Load older</p>
                                    }
                                </div>
                                <div ref={messagesRef}>
                                    {messages.map((message, i) => {
                                        return (
                                            <MessageCard key={i} chat={chat} currentUser={currentUser} message={message.messages} />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <form className="messageTextForm" onSubmit={sendMessageForm}>
                            <textarea className="messageTextInput text4" type="text" value={sendMessage} onChange={e => {setSendMessage(e.target.value)}} placeholder="Message" autoFocus />
                            <button className="messageTextSubmit" type="submit"><SendIcon fontSize="inherit" /></button>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default Chat
