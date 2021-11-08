import React from 'react'

const MediumCard = ({recipeReducer}) => {
    
    const rating = () => {
        if (recipeReducer.rating === 0) {
            return "No Rating"
        } else {
            return recipeReducer.rating + " Stars"
        }
    }

    const displayTime = () => {
        if (recipeReducer.time.min !== "" && recipeReducer.time.hr !== "") {
            return `${recipeReducer.time.hr}hr ${recipeReducer.time.min}mins`;
        } else if (recipeReducer.time.min === "" && recipeReducer.time.hr !== "") {
            return `${recipeReducer.time.hr}hr 0min`;
        } else if (recipeReducer.time.min !== "" && recipeReducer.time.hr === "") {
            return `0hr ${recipeReducer.time.min}mins`;
        }
    }

    return (
        <div className="mediumCard">
            <img src={`http://tasty-env.eba-c5emmwpy.eu-west-2.elasticbeanstalk.com/uploads/${recipeReducer.picture}`} className="img3" alt="Medium Recipe" />
            <p className="mediumCardTitle text3">{recipeReducer.title}</p>
            <div className="mediumCardInformation text5">
                <p className="mediumCardRating">{rating()}</p>
                <p className="mediumCardDifficulty">{recipeReducer.difficulty}</p>
                <p className="mediumCardTime">{displayTime()}</p>
            </div>
        </div>
    )
}

export default MediumCard
