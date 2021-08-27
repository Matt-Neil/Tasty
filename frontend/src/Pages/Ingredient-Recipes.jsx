import React, {useState, useEffect} from 'react'
import {Link, useParams} from "react-router-dom"
import recipeAPI from "../API/recipes"
import SmallCard from "../Components/Small-Card"

const IngredientRecipes = () => {
    const [loaded, setLoaded] = useState(false);
    const [ingredientRecipes, setIngredientRecipes] = useState([]);
    const [finished, setFinished] = useState(false);
    const ingredientID = useParams().id;

    useEffect(() => {
        fetchData(new Date().toISOString());
    }, [])

    const fetchData = async (date) => {
        if (!finished) {
            try {
                const ingredient = await recipeAPI.get(`/ingredient/${ingredientID}?createdAt=${date}`);
    
                if (ingredient.data.data.length === 0) {
                    setFinished(true);
                }

                setIngredientRecipes(ingredientRecipes => [...ingredientRecipes, ...ingredient.data.data]);
                setLoaded(true);
            } catch (err) {}
        }
    }

    window.onscroll = function() {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && ingredientRecipes.length !== 0) {
            {fetchData(ingredientRecipes[ingredientRecipes.length-1].createdAt)}
        }
    };

    return (
        <div className="mainBody">
            {loaded ?
                <>
                    <p className="text2" style={{marginLeft: 15}}>Recipes by Ingredients</p>
                    <div className="recipesRow">
                        { ingredientRecipes && ingredientRecipes.map((recipeReducer, i) => {
                            return (
                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer._id}`} key={i}>
                                    <SmallCard recipeReducer={recipeReducer} />
                                </Link>
                            )
                        })}
                    </div>
                    <div className="finished">
                        {finished ?
                            <p className="text4">You Have Reached the End!</p>
                            :
                            null
                        }
                    </div>
                </>
            :
                null
            }
        </div>
    )
}

export default IngredientRecipes
