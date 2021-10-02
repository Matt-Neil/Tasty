import React, { useState, useEffect, useContext } from "react";
import chatsAPI from "../API/chats"
import { ChatContext } from '../Contexts/chatContext';
const io = require("socket.io-client");

const Chat = () => {
    const [sendMessage, setSendMessage] = useState("")
    const [chat, setChat] = useState()
    const [chats, setChats] = useState()
    const [messages, setMessages] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [finished, setFinished] = useState(false)
    const [socket, setSocket] = useState()
    const {chatID, changeChatID} = useContext(ChatContext);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chats = await chatsAPI.get(`/`);
    
                if (chatID === undefined) {
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
            const newSocket = io("http://127.0.0.1:5000",
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
                <>
                    <form onSubmit={sendMessageForm}>
                        <input type="text" value={sendMessage} onChange={e => {setSendMessage(e.target.value)}} />
                        <input type="submit" />
                    </form>
                    {chats.map((chat, i) => {
                        return <button key={i} onClick={() => {changeChatID(chat._id)}}>{chat._id}</button>
                    })}
                    {messages.map((message, i) => {
                        return <p key={i}>{message.messages.message}</p>
                    })}
                    <div className="finished">
                        {finished ?
                            <p className="text4">No more messages!</p>
                            :
                            <p className="loadMore text4" onClick={() => {loadMore()}}>Load older</p>
                        }
                    </div>
                </>
            }
        </>
    )
}

export default Chat
