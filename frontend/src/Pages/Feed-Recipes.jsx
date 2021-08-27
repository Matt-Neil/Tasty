import React, {useState, useEffect} from 'react'
import {Link, useHistory} from "react-router-dom"
import userAPI from "../API/user"
import SmallCard from "../Components/Small-Card"

const FeedRecipes = () => {
    const [loaded, setLoaded] = useState(false);
    const [feedRecipes, setFeedRecipes] = useState([]);
    const [finished, setFinished] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetchData(new Date().toISOString());
    }, [])

    const fetchData = async (date) => {
        if (!finished) {
            try {
                const feed = await userAPI.get(`/feed?createdAt=${date}`);

                if (feed.data.user) {
                    if (feed.data.data.length === 0) {
                        setFinished(true)
                    } else {
                        setFeedRecipes(feedRecipes => [...feedRecipes, ...feed.data.data]);
                    }
                    setLoaded(true);
                } else {
                    history.push('/sign-in');
                }
            } catch (err) {}
        }
    }

    window.onscroll = function() {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && feedRecipes.length !== 0) {
            {fetchData(feedRecipes[feedRecipes.length-1].recipe.createdAt)}
        }
    };

    console.log(loaded)

    return (
        <div className="mainBody">
            {loaded ?
                <>
                    <p className="text2" style={{marginLeft: 15}}>My Feed</p>
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

export default FeedRecipes
