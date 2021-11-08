import React from 'react'
const moment = require('moment');

const MessageCard = ({message, currentUser, chat}) => {
    const date = moment(message.createdAt);

    const displaySide = () => {
        return currentUser.id === message.sender
    }
    
    const displaySender = () => {
        if (currentUser.id === message.sender) {
            return <p className="messagePerson text3">You</p>
        } else {
            if (message.sender === chat.user1.id) return <p className="messagePerson text3">{chat.user1.name}</p>
            return <p className="messagePerson text3">{chat.user2.name}</p>
        }
    }

    const displayTime = () => {
        return <p className="text5">{date.format("DD/MM/YYYY - HH:mm")}</p>
    }

    return (
        <>
            {displaySide() ?
                <div className="messageLeft">
                    <div className="messageHeader">
                        {displaySender()}
                        {displayTime()}
                    </div>
                    <p className="text4">{message.message}</p>
                </div>
            :
                <div className="messageRight">
                    <div className="messageHeader">
                        {displaySender()}
                        {displayTime()}
                    </div>
                    <p className="text4">{message.message}</p>
                </div>
            }
        </>
    )
}

export default MessageCard
