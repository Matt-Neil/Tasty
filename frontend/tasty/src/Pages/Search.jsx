import React, {useState, useEffect} from 'react'
import {Link, useHistory, useParams} from "react-router-dom"
import searchAPI from "../API/search"
import SmallCard from "../Components/Small-Card"
import UserCard from "../Components/User-Card"

const Search = ({searchPhrase}) => {
    const [displayUser, setDisplayUser] = useState(false);
    const [recipes, setRecipes] = useState();
    const [users, setUsers] = useState();
    const [loaded, setLoaded] = useState(false);
    const [finishedUsers, setFinishedUsers] = useState(false);
    const [finishedRecipes, setFinishedRecipes] = useState(false);
    const history = useHistory();
    const urlPhrase = useParams().id;

    useEffect(() => {
        const fetchDataInitial = async () => {
            try {
                if (searchPhrase === null) {
                    if (urlPhrase) {
                        const users = await searchAPI.get(`/users?phrase=${urlPhrase}`);
                        const recipes = await searchAPI.get(`/recipes?phrase=${urlPhrase}`);

                        if (users.data.data.length < 30) {
                            setFinishedUsers(true)
                        }
        
                        if (recipes.data.data.length < 20) {
                            setFinishedRecipes(true)
                        }

                        setRecipes(recipes.data.data);
                        setUsers(users.data.data);
                        setLoaded(true);
                    } else {
                        history.push("/");
                    }
                } else {
                    const users = await searchAPI.get(`/users?phrase=${searchPhrase}`);
                    const recipes = await searchAPI.get(`/recipes?phrase=${searchPhrase}`);

                    if (users.data.data.length < 30) {
                        setFinishedUsers(true)
                    }
    
                    if (recipes.data.data.length < 20) {
                        setFinishedRecipes(true)
                    }

                    setRecipes(recipes.data.data);
                    setUsers(users.data.data);
                    setLoaded(true);
                }
            } catch (err) {}
        }
        fetchDataInitial();
    }, [])

    const fetchDataUsers = async (id) => {
        if (!finishedUsers) {
            try {
                const results = await searchAPI.get(`/users?phrase=${searchPhrase}&id=${id}`);
    
                if (results.data.data.length < 30) {
                    setFinishedUsers(true)
                }

                setUsers(users => [...users, ...results.data.data]);
            } catch (err) {}
        }
    }

    const fetchDataRecipes = async (id) => {
        if (!finishedRecipes) {
            try {
                const results = await searchAPI.get(`/recipes?phrase=${searchPhrase}&id=${id}`);
    
                if (results.data.data.length < 20) {
                    setFinishedRecipes(true)
                }

                setRecipes(recipes => [...recipes, ...results.data.data]);
            } catch (err) {}
        }
    }

    const loadMore = () => {
        if (displayUser && users.length !== 0) {
            {fetchDataUsers(users[users.length-1]._id)}
        } 
        
        if (!displayUser && recipes.length !== 0) {
            {fetchDataRecipes(recipes[recipes.length-1]._id)}
        }
    };

    return (
        <>
            {loaded &&
                <>
                    {searchPhrase ?
                        <p className="text2">{"Search results for " + searchPhrase}</p>
                    :
                        <p className="text2">{"Search results for " + urlPhrase}</p>
                    }
                    {displayUser ?
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem" onClick={() => {setDisplayUser(false)}}>Recipes</p>
                                <p className="accountNavigationItem">USERS</p>
                            </div>
                            {users.length > 0 ?
                                <>
                                    <div className="homeRecipesRow">
                                        { users && users.map((userReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/recipes/${userReducer._id}`} key={i}>
                                                    <UserCard userReducer={userReducer.name} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        {finishedUsers ?
                                            <p className="text4">You Have Reached the End!</p>
                                            :
                                            <p className="loadMore text4" onClick={() => {loadMore()}}>Load more</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">No Users Found!</p>
                                </div>
                            }
                        </>
                    :
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem">RECIPES</p>
                                <p className="accountNavigationItem" onClick={() => {setDisplayUser(true)}}>Users</p>
                            </div>
                            {recipes.length > 0 ?
                                <>
                                    <div className="homeRecipesRow">
                                        { recipes && recipes.map((recipeReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.title}`} key={i}>
                                                    <SmallCard recipeReducer={recipeReducer} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        {finishedRecipes ?
                                            <p className="text4">You Have Reached the End!</p>
                                            :
                                            <p className="loadMore text4" onClick={() => {loadMore()}}>Load more</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">No Recipes Found!</p>
                                </div>
                            }
                        </>
                    }
                </>
            }
        </>
    )
}

export default Search
