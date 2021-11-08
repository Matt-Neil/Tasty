import React from 'react'
import {Link} from "react-router-dom"
import ChatIcon from '@mui/icons-material/Chat';

const OpenChat = () => {
    return (
        <Link to="/chat" className="openChatButton">
            <ChatIcon style={{fontSize: 24, color: "#FFFFFF"}} />
        </Link>
    )
}

export default OpenChat