import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import recipeAPI from "../API/recipes"
import SmallCard from "../Components/Small-Card"

const DinnerRecipes = () => {
    const [loaded, setLoaded] = useState(false);
    const [dinnerRecipes, setDinnerRecipes] = useState([]);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        fetchData(new Date().toISOString());
    }, [])

    const fetchData = async (date) => {
        if (!finished) {
            try {
                const dinner = await recipeAPI.get(`/dinner?createdAt=${date}`);
    
                if (dinner.data.data.length < 20) {
                    setFinished(true)
                }

                setDinnerRecipes(dinnerRecipes => [...dinnerRecipes, ...dinner.data.data]);
                setLoaded(true);
            } catch (err) {}
        }
    }

    const loadMore = () => {
        if (dinnerRecipes.length !== 0) {
            {fetchData(dinnerRecipes[dinnerRecipes.length-1].createdAt)}
        }
    };

    return (
        <>
            {loaded ?
                <>
                    <p className="marginText text2">Dinner recipes</p>
                    <div className="recipesRow">
                        { dinnerRecipes && dinnerRecipes.map((recipeReducer, i) => {
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
        </>
    )
}

export default DinnerRecipes
