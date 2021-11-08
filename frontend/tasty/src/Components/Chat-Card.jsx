import React, {useContext} from 'react'
import { ChatContext } from '../Contexts/chatContext';

const ChatCard = ({currentUser, chat}) => {
    const {chatID, changeChatID} = useContext(ChatContext);

    const displayUser = () => {
        if (currentUser.id === chat.user1.id) {
            return <p className="chatPerson text3">{chat.user2.name}</p>
        } else {
            return <p className="chatPerson text3">{chat.user2.name}</p>
        }
    }

    const displayPicture = () => {
        if (currentUser.id === chat.user1.id) {
            return <img src={`http://tasty-env.eba-c5emmwpy.eu-west-2.elasticbeanstalk.com/uploads/${chat.user2.picture}`} className="img8" alt="User Avatar" />
        } else {
            return <img src={`http://tasty-env.eba-c5emmwpy.eu-west-2.elasticbeanstalk.com/uploads/${chat.user2.picture}`} className="img8" alt="User Avatar" />
        }
    }

    return (
        <>
            {chatID === chat._id ?
                <div className="chatUserCardCurrent" onClick={() => {changeChatID(chat._id)}}>
                    {displayPicture()}
                    {displayUser()}
                </div>
            :
                <div className="chatUserCard" onClick={() => {changeChatID(chat._id)}}>
                    {displayPicture()}
                    {displayUser()}
                </div>  
            }
        </>
    )
}

export default ChatCard
