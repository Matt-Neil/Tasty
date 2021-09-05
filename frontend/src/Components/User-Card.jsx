import React from 'react'

const smallCard = ({userReducer}) => {
    return (
        <div className="userCard">
            <img src={`http://localhost:5000/uploads/${userReducer.picture}`} className="img7" alt="User Avatar" />
            <p className="userCardName text3">{userReducer.name}</p>
        </div>
    )
}

export default smallCard
