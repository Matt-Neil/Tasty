import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import recipeAPI from "../API/recipes"
import SmallCard from "../Components/Small-Card"

const DessertRecipes = () => {
    const [loaded, setLoaded] = useState(false);
    const [dessertRecipes, setDessertRecipes] = useState([]);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        fetchData(new Date().toISOString());
    }, [])

    const fetchData = async (date) => {
        if (!finished) {
            try {
                const dessert = await recipeAPI.get(`/dessert?createdAt=${date}`);
    
                if (dessert.data.data.length === 0) {
                    setFinished(true)
                }

                setDessertRecipes(dessertRecipes => [...dessertRecipes, ...dessert.data.data]);
                setLoaded(true);
            } catch (err) {}
        }
    }

    window.onscroll = function() {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && dessertRecipes.length !== 0) {
            {fetchData(dessertRecipes[dessertRecipes.length-1].createdAt)}
        }
    };

    return (
        <div className="mainBody">
            {loaded ?
                <>
                    <p className="text2" style={{marginLeft: 15}}>Dessert Recipes</p>
                    <div className="recipesRow">
                        { dessertRecipes && dessertRecipes.map((recipeReducer, i) => {
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
                            <p className="text4">Load More!</p>
                        }
                    </div>
                </>
            :
                null
            }
        </div>
    )
}

export default DessertRecipes
