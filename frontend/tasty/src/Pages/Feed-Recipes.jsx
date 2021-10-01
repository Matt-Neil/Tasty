import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import userAPI from "../API/user"
import SmallCard from "../Components/Small-Card"

const FeedRecipes = () => {
    const [loaded, setLoaded] = useState(false);
    const [feedRecipes, setFeedRecipes] = useState([]);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        fetchData(new Date().toISOString());
    }, [])

    const fetchData = async (date) => {
        if (!finished) {
            try {
                const feed = await userAPI.get(`/feed?createdAt=${date}`);

                if (feed.data.data.length < 20) {
                    setFinished(true)
                }

                setFeedRecipes(feedRecipes => [...feedRecipes, ...feed.data.data]);
                setLoaded(true);
            } catch (err) {}
        }
    }

    const loadMore = () => {
        if (feedRecipes.length !== 0) {
            {fetchData(feedRecipes[feedRecipes.length-1].recipe.createdAt)}
        }
    };

    return (
        <>
            {loaded ?
                <>
                    <p className="marginText text2">Your feed</p>
                    <div className="recipesRow">
                        { feedRecipes && feedRecipes.map((recipeReducer, i) => {
                            return (
                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.recipe._id}`} key={i}>
                                    <SmallCard recipeReducer={recipeReducer.recipe} />
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

export default FeedRecipes
