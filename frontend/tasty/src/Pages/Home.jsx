import React, {useEffect, useState} from 'react'
import {Link} from "react-router-dom"
import recipesAPI from "../API/recipes"
import userAPI from "../API/user"
import SmallCard from "../Components/Small-Card"
import LargeCard from "../Components/Large-Card"
import MediumCard from "../Components/Medium-Card"
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const Home = () => {
    const [discoverRecipes, setDiscoverRecipes] = useState();
    const [latestRecipes, setLatestRecipes] = useState();
    const [feedRecipes, setFeedRecipes] = useState();
    const [popularRecipes, setPopularRecipes] = useState();
    const [dinnerRecipes, setDinnerRecipes] = useState();
    const [dessertRecipes, setDessertRecipes] = useState();
    const [loaded, setLoaded] = useState(false);
    const [latestPage, setLatestPage] = useState(0);
    const [popularPage, setPopularPage] = useState(0);
    const [numberSmallCards, setNumberSmallCards] = useState();
    const [mobile, setMobile] = useState(window.innerWidth < 801);
    const [tablet, setTablet] = useState(window.innerWidth < 1051);
    const ingredients = [
        {ingredient: "Beef Recipes", url: "beef"},
        {ingredient: "Chicken Recipes", url: "chicken"},
        {ingredient: "Cheese Recipes", url: "cheese"},
        {ingredient: "Fish Recipes", url: "fish"},
        {ingredient: "Lamb Recipes", url: "lamb"},
        {ingredient: "Pork Recipes", url: "pork"},
        {ingredient: "Vegetable Recipes", url: "vegetable"},
        {ingredient: "Pasta Recipes", url: "pasta"},
        {ingredient: "Fruit Recipes", url: "fruit"},
        {ingredient: "Chocolate Recipes", url: "chocolate"},
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const popular = await recipesAPI.get("/popular");
                const discover = await recipesAPI.get("/discover");
                const latest = await recipesAPI.get("/latest");
                const dinner = await recipesAPI.get("/short/dinner");
                const dessert = await recipesAPI.get("/short/dessert");
                const feed = await userAPI.get("/short/feed");

                if (feed.data.user) {
                    setFeedRecipes(feed.data.data);
                }

                setDiscoverRecipes(discover.data.data);
                setLatestRecipes(latest.data.data);
                setPopularRecipes(popular.data.data);
                setDinnerRecipes(dinner.data.data);
                setDessertRecipes(dessert.data.data);
                setLoaded(true);
            } catch (err) {}
        }
        fetchData();
    }, [])

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    useEffect(() => {
        window.addEventListener("resize", calculateNumberSmallCards);
        return () => window.removeEventListener("resize", calculateNumberSmallCards);
    });

    useEffect(() => {
        calculateNumberSmallCards();
    }, [])

    const updateMedia = () => {
        setMobile(window.innerWidth < 801);
        setTablet(window.innerWidth < 1051);
    };

    const calculateNumberSmallCards = () => {
        const number = Math.floor((window.innerWidth-60) / 265);

        if (number > 5) {
            setNumberSmallCards(5);
        } else {
            setNumberSmallCards(number);
        }
    }

    const updateLatestPage = (direction) => {
        let temp;

        if (direction === "left") {
            if (latestPage <= 0) {
                setLatestPage((Math.ceil(20 / numberSmallCards) * numberSmallCards) - numberSmallCards);
            } else {
                temp = latestPage - numberSmallCards;
                setLatestPage(temp)
            }
        } else {
            if (latestPage >= (20 - numberSmallCards)) {
                setLatestPage(0)
            } else {
                temp = latestPage + numberSmallCards;
                setLatestPage(temp)
            }
        }
    }

    const updatePopularPage = (direction) => {
        let temp;
        
        if (direction === "left") {
            if (popularPage <= 0) {
                setPopularPage((Math.ceil(20 / numberSmallCards) * numberSmallCards) - numberSmallCards);
            } else {
                temp = popularPage - numberSmallCards;
                setPopularPage(temp)
            }
        } else {
            if (popularPage >= (20 - numberSmallCards)) {
                setPopularPage(0)
            } else {
                temp = popularPage + numberSmallCards;
                setPopularPage(temp)
            }
        }
    }

    return (
        <div className="mainBody">
            {loaded ?
                <>
                    {feedRecipes ?
                        <>
                            <div className="homeHeader">
                                <p className="marginText text2">Your feed</p>
                                <div className="homeNavigation">
                                    <Link className="homeLink text5" to="/my-feed">See more</Link>
                                </div>
                            </div>
                            {feedRecipes.length === 0 && 
                                <div className="finished">
                                    <p className="text4">Your feed is empty!</p>
                                </div>
                            }
                            {feedRecipes.length === 1 &&
                                <div className="recipesGrid">
                                    <Link className={"recipeLinkLarge"} to={`/recipes/${feedRecipes[0].recipe._id}`}>
                                        <LargeCard recipeReducer={feedRecipes[0].recipe} />
                                    </Link>
                                </div>
                            }
                            {feedRecipes.length === 2 && 
                                <div className="recipesGrid">
                                    <Link className={"recipeLinkLarge"} to={`/recipes/${feedRecipes[0].recipe._id}`}>
                                        <LargeCard recipeReducer={feedRecipes[0].recipe} />
                                    </Link>
                                    <Link className="recipeLinkMediumTop" to={`/recipes/${feedRecipes[1].recipe._id}`}>
                                        <MediumCard recipeReducer={feedRecipes[1].recipe} />
                                    </Link>
                                </div>
                            }
                            {feedRecipes.length === 3 && 
                                <div className="recipesGrid">
                                    <Link className={"recipeLinkLarge"} to={`/recipes/${feedRecipes[0].recipe._id}`}>
                                        <LargeCard recipeReducer={feedRecipes[0].recipe} />
                                    </Link>
                                    <Link className="recipeLinkMediumTop" to={`/recipes/${feedRecipes[1].recipe._id}`}>
                                        <MediumCard recipeReducer={feedRecipes[1].recipe} />
                                    </Link>
                                    <Link className="recipeLinkMediumBottom" to={`/recipes/${feedRecipes[2].recipe._id}`}>
                                        <MediumCard recipeReducer={feedRecipes[2].recipe} />
                                    </Link>
                                </div>
                            }
                            <p className="marginText text2">Discover recipes</p>
                            <div className="recipesRow">
                                { discoverRecipes && discoverRecipes.filter((recipes, x) => x <= numberSmallCards-1).map((recipeReducer, i) => {
                                    return (
                                        <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer._id}`} key={i}>
                                            <SmallCard recipeReducer={recipeReducer} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </>
                    :
                        <>  
                            <p className="marginText text2">Discover recipes</p>
                            {tablet ?
                                <div className="recipesGrid">
                                    <Link className={"recipeLinkLarge"} to={`/recipes/${discoverRecipes[0]._id}`}>
                                        <LargeCard recipeReducer={discoverRecipes[0]} />
                                    </Link>
                                    <Link className="recipeLinkMediumTop" to={`/recipes/${discoverRecipes[1]._id}`}>
                                        <MediumCard recipeReducer={discoverRecipes[1]} />
                                    </Link>
                                </div>
                            :
                                <div className="recipesGrid">
                                    <Link className={"recipeLinkLarge"} to={`/recipes/${discoverRecipes[0]._id}`}>
                                        <LargeCard recipeReducer={discoverRecipes[0]} />
                                    </Link>
                                    <Link className="recipeLinkMediumTop" to={`/recipes/${discoverRecipes[1]._id}`}>
                                        <MediumCard recipeReducer={discoverRecipes[1]} />
                                    </Link>
                                    <Link className="recipeLinkMediumBottom" to={`/recipes/${discoverRecipes[2]._id}`}>
                                        <MediumCard recipeReducer={discoverRecipes[2]} />
                                    </Link>
                                </div>
                            }
                        </>
                    }
                    <div className="homeHeader">
                        <p className="marginText text2">Latest recipes</p>
                        <div className="homeNavigation">
                            {!mobile && <p className="text5">{"Page " + (Math.ceil(latestPage / numberSmallCards + 1)) + "/" + (Math.ceil(20 / numberSmallCards))}</p>}
                            <button className="homeLeftButton"
                                    onClick={e => {updateLatestPage("left")}}><ArrowBackIosIcon style={{fontSize: 18, color: "#363636", margin: "3px 0 0 4px"}} /></button>
                            <button className="homeRightButton"
                                    onClick={e => {updateLatestPage("right")}}><ArrowForwardIosIcon style={{fontSize: 18, color: "#363636", margin: "3px 0 0 2px"}} /></button>
                        </div>
                    </div>
                    <div className="recipesRow">
                        { latestRecipes && latestRecipes.filter((recipes, x) => x >= latestPage && x <= (latestPage+(numberSmallCards-1))).map((recipeReducer, i) => {
                            return (
                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer._id}`} key={i}>
                                    <SmallCard recipeReducer={recipeReducer} />
                                </Link>
                            )
                        })}
                    </div>
                    <div className="homeHeader">
                        <p className="marginText text2">Popular recipes</p>
                        <div className="homeNavigation">
                            {!mobile && <p className="text5">{"Page " + (Math.ceil(popularPage / numberSmallCards + 1)) + "/" + (Math.ceil(20 / numberSmallCards))}</p>}
                            <button className="homeLeftButton"
                                    onClick={e => {updatePopularPage("left")}}><ArrowBackIosIcon style={{fontSize: 18, color: "#363636", margin: "3px 0 0 4px"}} /></button>
                            <button className="homeRightButton"
                                    onClick={e => {updatePopularPage("right")}}><ArrowForwardIosIcon style={{fontSize: 18, color: "#363636", margin: "3px 0 0 2px"}} /></button>
                        </div>
                    </div>
                    <div className="recipesRow">
                        { popularRecipes && popularRecipes.filter((recipe, x) => x >= popularPage && x <= (popularPage+(numberSmallCards-1))).map((recipeReducer, i) => {
                            return (
                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer._id}`} key={i}>
                                    <SmallCard recipeReducer={recipeReducer} />
                                </Link>
                            )
                        })}
                    </div>
                    <div className="homeHeader">
                        <p className="marginText text2">Dinner recipes</p>
                        <div className="homeNavigation">
                            <Link className="homeLink text5" to="/recipes/dinner">See more</Link>
                        </div>
                    </div>
                    <div className="recipesRow">
                        { dinnerRecipes && dinnerRecipes.filter((recipes, x) => x <= numberSmallCards-1).map((recipeReducer, i) => {
                            return (
                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer._id}`} key={i}>
                                    <SmallCard recipeReducer={recipeReducer} />
                                </Link>
                            )
                        })}
                    </div>
                    <div className="homeHeader">
                        <p className="marginText text2">Dessert recipes</p>
                        <div className="homeNavigation">
                            <Link className="homeLink text5" to="/recipes/dessert">See more</Link>
                        </div>
                    </div>
                    <div className="recipesRow">
                        { dessertRecipes && dessertRecipes.filter((recipes, x) => x <= numberSmallCards-1).map((recipeReducer, i) => {
                            return (
                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer._id}`} key={i}>
                                    <SmallCard recipeReducer={recipeReducer} />
                                </Link>
                            )
                        })}
                    </div>
                    <p className="marginText text2">Find recipes by ingredients</p>
                    <div className="homeIngredientsRow">
                        { ingredients.map((ingredientReducer, i) => {
                            return (
                                <Link className={"ingredientLink text4"} to={`/recipes/ingredients/${ingredientReducer.url}`} key={i}>{ingredientReducer.ingredient}</Link>
                            )
                        })}
                    </div>
                </>
            :    
                null
            }
        </div>
    )
}

export default Home
