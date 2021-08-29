import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from "react-router-dom"
import recipeAPI from "../API/recipes"
const moment = require('moment');

const Recipe = () => {
    const [user, setUser] = useState();
    const [recipe, setRecipe] = useState();
    const [loaded, setLoaded] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState();
    const recipeID = useParams().id;
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await recipeAPI.get(`/recipe/${recipeID}`);
                
                setUser(response.data.user);
                setRecipe(response.data.data.recipe);
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

        await recipeAPI.put(`/recipe/${recipeID}`, 
        {
            review: { comment: comment, rating: Number(rating), date: moment().format('DD/MM/YYYY') }
        });

        setComment("");
        setRating();
    }

    return (
        <div className="mainBody">
            {loaded ?
                <>
                    {user ?
                        <>
                            <button onClick={() => {editRecipe()}}>Edit</button>
                            <button onClick={() => {deleteRecipe()}}>Delete</button>
                        </>
                    :
                        <form method="POST" onSubmit={addReview}>
                            <div>
                                <input type="text" name="commend" placeholder="comment" value={comment} onChange={e => {setComment(e.target.value)}} />
                                <input type="text" name="rating" placeholder="rating" value={rating} onChange={e => {setRating(e.target.value)}} />
                            </div>
                            <div>
                                <input type="submit" value="Add Review" />
                            </div>
                        </form>
                    }
                    
                </>
                :
                null
            }
        </div>
    )
}

export default Recipe
