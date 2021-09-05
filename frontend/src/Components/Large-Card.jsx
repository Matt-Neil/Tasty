import React from 'react'

const LargeCard = ({recipeReducer}) => {

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
        <div className="largeCard">
            <img src={`http://localhost:5000/uploads/${recipeReducer.picture}`} className="img2" alt="Large Recipe" />
            <p className="largeCardTitle text3">{recipeReducer.title}</p>
            <div className="largeCardInformation text5">
                <p className="largeCardRating">{rating()}</p>
                <p className="largeCardDifficulty">{recipeReducer.difficulty}</p>
                <p className="largeCardTime">{displayTime()}</p>
            </div>
        </div>
    )
}

export default LargeCard