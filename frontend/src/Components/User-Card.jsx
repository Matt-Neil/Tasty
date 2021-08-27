import React from 'react'

const smallCard = ({userReducer}) => {
    return (
        <div className="smallCard">
            <img src="https://via.placeholder.com/175" alt="User Avatar" />
            <p className="smallCardTitle text4">{userReducer}</p>
        </div>
    )
}

export default smallCard
