import React from 'react'

const SmallCard = ({recipeReducer}) => {

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
        <div className="smallCard">
            <img src={`http://localhost:5000/uploads/${recipeReducer.picture}`} className="img5" alt="Recipe Small" />
            <p className="smallCardTitle text4">{recipeReducer.title}</p>
            <div className="smallCardInformation text6">
                <p className="smallCardRating">{rating()}</p>
                <p className="smallCardDifficulty">{recipeReducer.difficulty}</p>
                <p className="smallCardTime">{displayTime()}</p>
            </div>
        </div>
    )
}

export default SmallCard
