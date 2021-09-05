import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from "react-router-dom"
import recipeAPI from "../API/recipes"
import userAPI from "../API/user"
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ReviewCard from '../Components/Review-Card';
import SmallCard from "../Components/Small-Card"
const moment = require('moment');

const Recipe = () => {
    const [creator, setCreator] = useState();
    const [saved, setSaved] = useState();
    const [recipe, setRecipe] = useState();
    const [related, setRelated] = useState();
    const [loaded, setLoaded] = useState(false);
    const [comment, setComment] = useState("No Comment");
    const [rating, setRating] = useState();
    const [errors, setErrors] = useState({rating: undefined});
    const [loadMore, setLoadMore] = useState(false);
    const recipeID = useParams().id;
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await recipeAPI.get(`/recipe/${recipeID}`);
                
                setCreator(response.data.creator);
                setRecipe(response.data.data.recipe);
                setRelated(response.data.data.related);
                if (!creator) {
                    setSaved(response.data.saved);
                }
                setLoaded(true);
            } catch (err) {
                history.replace(`/`);
            }
        }
        fetchData();
    }, [recipeID])

    const editRecipe = async () => {
        history.push(`/edit-recipe/${recipeID}`);
    }

    const deleteRecipe = async () => {
        await recipeAPI.delete(`/recipe/${recipeID}`)

        history.push(`/my-profile`);
    }

    const addReview = async (e) => {
        e.preventDefault();
        e.target.reset();

        try {
            await recipeAPI.put(`/recipe/${recipeID}`, 
            {
                review: { comment: comment, rating: Number(rating), date: moment().format('DD/MM/YYYY') }
            });

            setComment("");
            setRating();
            setErrors();
        } catch (err) {
            setErrors(err.response.data.errors);
        }
    }

    const handleSave = async () => {
        if (saved) {
            try {
                await userAPI.put(`/profile?update=saved`, {
                    id: recipe._id,
                    remove: true
                })
            } catch (err) {}
        } else {
            try {
                await userAPI.put(`/profile?update=saved`, {
                    id: recipe._id,
                    remove: false
                })
            } catch (err) {}
        }
        setSaved(saved => !saved)
    }

    const displayRating = () => {
        if (recipe.rating === 0) {
            return "No Rating"
        } else {
            return recipe.rating + " Stars"
        }
    }

    const displayTime = () => {
        if (recipe.time.min !== "" && recipe.time.hr !== "") {
            return `${recipe.time.hr}hr ${recipe.time.min}mins`;
        } else if (recipe.time.min === "" && recipe.time.hr !== "") {
            return `${recipe.time.hr}hr 0min`;
        } else if (recipe.time.min !== "" && recipe.time.hr === "") {
            return `0hr ${recipe.time.min}mins`;
        }
    }

    return (
        <div className="mainBody">
            {loaded ?
                <div className="innerBody">
                    <p className="recipeTitle">{recipe.title}</p>
                    <div className="recipeRow">
                        <img src={`http://localhost:5000/uploads/${recipe.picture}`} className="img1" alt="User Avatar" />
                        <div className="recipeInformation text4">
                            <div className="recipeInformationSmall">
                                <p className="recipeRating">{displayRating()}</p>
                                <p className="recipeDifficulty">{recipe.difficulty}</p>
                                <p className="recipeTime">{displayTime()}</p>
                                <p className="recipeServings">{"Serves " + recipe.servings}</p>
                            </div>
                            <p className="recipeDescription">{recipe.description}</p>
                            <p className="recipeCreator text5">Created by <Link className="recipeCreatorLink text5" to={`/user/${recipe.creator._id}`}>{recipe.creator.name}</Link></p>
                            {creator ?
                                <>
                                    <button className="recipeEdit text4" onClick={() => {editRecipe()}}>Edit</button>
                                    <button className="recipeDelete text4" onClick={() => {deleteRecipe()}}>Delete</button>
                                </>
                            :
                                <>
                                    {saved ?
                                        <button className="saveRecipeButton"
                                                onClick={() => {handleSave()}}>
                                                    <BookmarkIcon style={{fontSize: 24, color: "#FFFFFF", marginRight: 7, marginLeft: 7}} />
                                                    <p className="saveRecipeText text4">Unsave</p>
                                        </button>
                                    :
                                        <button className="saveRecipeButton"
                                                onClick={() => {handleSave()}}>
                                                    <BookmarkBorderIcon style={{fontSize: 24, color: "#FFFFFF", marginRight: 7, marginLeft: 7}} />
                                                    <p className="saveRecipeText text4">Save</p>
                                        </button>
                                    }
                                </>
                            }
                        </div>
                    </div>
                    <div className="recipeColumns">
                        <div className="recipeLeftColumn">
                            <p className="recipeHeader text2">Ingredients</p>
                            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => {
                                if (ingredient.unit === "none") {
                                    return (
                                        <p className="recipeDisplayIngredients text4" key={i}>{ingredient.measurement + " " + ingredient.ingredient}</p>
                                    )
                                } else {
                                    return (
                                        <p className="recipeDisplayIngredients text4" key={i}>{ingredient.measurement + ingredient.unit + " " + ingredient.ingredient}</p>
                                    )
                                }
                            })}
                            <p className="recipeHeader text2">Method</p>
                            {recipe.steps && recipe.steps.map((step, i) => {
                                return (
                                    <div className="recipeSteps" key={i}>
                                        <p className="recipeDisplayNumber text2">{i+1}</p>
                                        <p className="recipeDisplayStep text4">{step}</p>
                                    </div>
                                )
                            })}
                            {!creator &&
                                <>
                                    <p className="recipeHeader text2">Leave a review?</p>
                                    <form method="POST" onSubmit={addReview}>
                                        <div className="recipeAddReview">
                                            <input className="textInputReviewRating text5" type="text" name="rating" placeholder="Rating" value={rating} onChange={e => {setRating(e.target.value)}} />
                                            {errors.rating && <p className="displayError text5">{errors.rating}</p> }
                                            <textarea className="textareaInput textInputReview text5" type="text" name="comment" placeholder="Comment" maxLength="500" rows="5" onChange={e => {setComment(e.target.value)}} />
                                        </div>
                                        <div>
                                            <input className="addReview text4" type="submit" value="Submit Review" />
                                        </div>
                                    </form>
                                </>
                            }
                            <p className="recipeHeader text2">People's thoughts</p>
                            {recipe.reviews.length !== 0 ?
                                <>
                                    {!loadMore ?
                                        <>
                                            {recipe.reviews.length === 1 && 
                                                <div className="reviewsRow">
                                                    <ReviewCard review={recipe.reviews[0]} />
                                                </div>
                                            }
                                            {recipe.reviews.length > 1 && 
                                                <div className="reviewsRow">
                                                    <ReviewCard review={recipe.reviews[0]} />
                                                    <ReviewCard review={recipe.reviews[1]} />
                                                </div>
                                            }
                                            <p className="loadMore text4" onClick={() => {setLoadMore(true)}}>Show More</p>
                                        </>
                                    :
                                        <>
                                            <div className="reviewsRow">
                                                {recipe.reviews.length <= 2 ?
                                                    <>
                                                        {recipe.reviews.length === 1 && 
                                                            <div className="reviewsRow">
                                                                <ReviewCard review={recipe.reviews[0]} />
                                                            </div>
                                                        }
                                                        {recipe.reviews.length > 1 && 
                                                            <div className="reviewsRow">
                                                                <ReviewCard review={recipe.reviews[0]} />
                                                                <ReviewCard review={recipe.reviews[1]} />
                                                            </div>
                                                        }
                                                        <p className="text5">No more reviews</p>
                                                    </>
                                                :
                                                    <>
                                                        {recipe.reviews && recipe.reviews.map((review, i) => {
                                                            return (
                                                                <ReviewCard key={i} review={review} />
                                                            )
                                                        })}
                                                    </>
                                                }
                                            </div>
                                            <p className="loadMore text4" onClick={() => {setLoadMore(false)}}>Show Less</p>
                                        </>
                                    }
                                    
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">No reviews!</p>
                                </div>
                            }
                        </div>
                        <div className="recipeRightColumn">
                            <p className="marginText recipeHeader text2">You might also like...</p>
                            <div className="relatedRecipesRow">
                                { related && related.map((recipeReducer, i) => {
                                    return (
                                        <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer._id}`} key={i}>
                                            <SmallCard recipeReducer={recipeReducer} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                :
                null
            }
        </div>
    )
}

export default Recipe
