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

    const ingredientTitle = () => {
        let title;

        switch (ingredientID) {
            case "beef":
                title = "Beef recipes"
                break;
            case "chicken":
                title = "Chicken recipes"
                break;
            case "cheese":
                title = "Cheese recipes"
                break;
            case "fish":
                title = "Fish recipes"
                break;
            case "lamb":
                title = "Lamb recipes"
                break;
            case "pork":
                title = "Pork recipes"
                break;
            case "vegetable":
                title = "Vegetable recipes"
                break;
            case "pasta":
                title = "Pasta recipes"
                break;
            case "fruit":
                title = "Fruit recipes"
                break;
            case "chocolate":
                title = "Chocolate recipes"
                break;
        }

        return title
    }

    const loadMore = () => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && ingredientRecipes.length !== 0) {
            {fetchData(ingredientRecipes[ingredientRecipes.length-1].createdAt)}
        }
    };

    return (
        <div className="mainBody">
            {loaded ?
                <>
                    <p className="marginText text2">{ingredientTitle()}</p>
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
                            <p className="text4">You have reached the end!</p>
                            :
                            <p className="loadMore text4" onClick={() => {loadMore()}}>Load more</p>
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
