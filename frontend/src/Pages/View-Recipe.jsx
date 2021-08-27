import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from "react-router-dom"
import recipeAPI from "../API/recipes"

const Recipe = () => {
    const [user, setUser] = useState();
    const [recipe, setRecipe] = useState();
    const [loaded, setLoaded] = useState(false);
    const recipeID = useParams().id;
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await recipeAPI.get(`recipe/${recipeID}`);

                setUser(response.data.user);
                setRecipe(response.data.data.recipe);
                setLoaded(true);
            } catch (err) {}
        }
        fetchData();
    }, [recipeID])

    const editRecipe = async () => {
        history.push(`/edit-recipe/${recipeID}`);
    }

    const deleteRecipe = async () => {
        await recipeAPI.delete(`/${recipeID}`)

        history.push(`/my-profile`);
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
                        null
                    }
                    
                </>
                :
                null
            }
        </div>
    )
}

export default Recipe
