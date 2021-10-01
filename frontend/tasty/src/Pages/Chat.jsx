import React, { useState, useEffect } from "react";
import chatsAPI from "../API/chats"
const io = require("socket.io-client");

const Chat = () => {
    const [sendMessage, setSendMessage] = useState("")
    const [chat, setChat] = useState()
    const [messages, setMessages] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [finished, setFinished] = useState(false)
    const [socket, setSocket] = useState()

    useEffect(() => {
        fetchData(new Date().toISOString())
    }, [])

    const fetchData = async (date) => {
        if (!finished) {
            try {
                if (!chat) {
                    const chat = await chatsAPI.get("/6155ae82a78484ddcf767573");

                    setChat(chat.data.data)
                }
                
                const messages = await chatsAPI.get(`/6155ae82a78484ddcf767573/messages?date=${date}`);
    
                messages.data.data.reverse()
    
                if (messages.data.data.length < 20) {
                    setFinished(true)
                }
    
                setMessages(previousState => [...messages.data.data, ...previousState])
                setLoaded(true)
            } catch (err) {}
        }
    }

    useEffect(() => {
        if (loaded) {
            const newSocket = io("http://127.0.0.1:5000",
                {
                    query: {
                        id: chat._id
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

    console.log(socket)

    const sendMessageForm = async (e) => {
        e.preventDefault();

        const newMessage = await chatsAPI.put('/6155ae82a78484ddcf767573', {
            message: sendMessage
        })

        socket.emit('sendMessage', newMessage.data.data);

        setSendMessage("")
    }

    const loadMore = () => {
        if (messages.length !== 0) {
            {fetchData(messages[0].messages.createdAt)}
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
