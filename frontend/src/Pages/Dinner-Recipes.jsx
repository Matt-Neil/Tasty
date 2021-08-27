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
    
                if (dinner.data.data.length === 0) {
                    setFinished(true)
                }

                setDinnerRecipes(dinnerRecipes => [...dinnerRecipes, ...dinner.data.data]);
                setLoaded(true);
            } catch (err) {}
        }
    }

    window.onscroll = function() {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && dinnerRecipes.length !== 0) {
            {fetchData(dinnerRecipes[dinnerRecipes.length-1].createdAt)}
        }
    };

    return (
        <div className="mainBody">
            {loaded ?
                <>
                    <p className="text2" style={{marginLeft: 15}}>Dinner Recipes</p>
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

export default DinnerRecipes
