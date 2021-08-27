import React from 'react'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

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
            <button className="saveRecipeButton"><BookmarkBorderIcon style={{fontSize: 18, color: "#FFFFFF"}} /></button>
            <img src="https://via.placeholder.com/235" alt="Recipe Image" />
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
