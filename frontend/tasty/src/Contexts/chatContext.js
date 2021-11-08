import React, {createContext, useEffect, useState} from 'react'

export const ChatContext = createContext()

const ChatContextProvider = (props) => {
    const [chatID, setChatID] = useState("");

    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('chatID'));
        
        if (localData !== null) {
            setChatID(localData);
        }
    }, [])

    const changeChatID = (id) => {
        setChatID(id);
    }

    useEffect(() => {
        localStorage.setItem('chatID', JSON.stringify(chatID));
    }, [chatID])

    return (
        <ChatContext.Provider value={{chatID, changeChatID}}>
            {props.children}
        </ChatContext.Provider>
    )
}

export default ChatContextProvider
