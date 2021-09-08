import React from 'react'
import {Link} from "react-router-dom"

const ReviewCard = ({review}) => {
    const displayRating = () => {
        if (review.rating === 0) {
            return "No Rating"
        } else {
            return review.rating + " Stars"
        }
    }

    return (
        <div className="reviewCard">
            <div className="reviewCardInformation text4">
                <Link className="reviewCardName" to={`/user/${review.author._id}`}>{review.author.name}</Link>
                <p className="reviewCardDate">{review.date}</p>
                <p className="reviewCardRating">{displayRating()}</p>
            </div>
            <p className="reviewCardComment text5">{review.comment}</p>
        </div>
    )
}

export default ReviewCard
