import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from "react-router-dom"
import userAPI from "../API/user"
import UserCard from "../Components/User-Card"
import SmallCard from "../Components/Small-Card"

const Account = () => {
    const [user, setUser] = useState();
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();
    const [created, setCreated] = useState();
    const [accountDisplay, setAccountDisplay] = useState(true);
    const [followingDisplay, setFollowingDisplay] = useState(false);
    const [followersDisplay, setFollowersDisplay] = useState(false);
    const [finishedCreated, setFinishedCreated] = useState(false);
    const [finishedFollowers, setFinishedFollowers] = useState(false);
    const [finishedFollowing, setFinishedFollowing] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const userID = useParams().id;
    const history = useHistory();

    useEffect(() => {
        const fetchDataInitial = async () => {
            try {
                const user = await userAPI.get(`/${userID}`);
                const followers = await userAPI.get(`/${userID}/followers`);
                const following = await userAPI.get(`/${userID}/following`);
                const created = await userAPI.get(`/${userID}/created?date=${new Date().toISOString()}`);

                setUser(user.data.data);
                setFollowers(followers.data.data);
                setFollowing(following.data.data);
                setCreated(created.data.data);
                setLoaded(true);
            } catch (err) {
                history.replace('/');
            }
        }
        fetchDataInitial();
    }, [userID])

    const changeSelection = (selection) => {
        switch (selection) {
            case "account":
                setAccountDisplay(true);
                setFollowingDisplay(false);
                setFollowersDisplay(false);
                break;
            case "following":
                setAccountDisplay(false);
                setFollowingDisplay(true);
                setFollowersDisplay(false);
                break;
            case "followers":
                setAccountDisplay(false);
                setFollowingDisplay(false);
                setFollowersDisplay(true);
                break;
            default:
                setAccountDisplay(true);
                setFollowingDisplay(false);
                setFollowersDisplay(false);
                break;
        }
    }

    const fetchDataCreated = async (date) => {
        if (!finishedCreated) {
            try {
                const results = await userAPI.get(`/${userID}/created?date=${date}`);
    
                if (results.data.data.length === 0) {
                    setFinishedCreated(true)
                }

                setCreated(created => [...created, ...results.data.data]);
            } catch (err) {}
        }
    }

    const fetchDataFollowers = async (id) => {
        if (!finishedFollowers) {
            try {
                const results = await userAPI.get(`/${userID}/followers?id=${id}`);
    
                if (results.data.data.length === 0) {
                    setFinishedFollowers(true)
                }

                setFollowers(followers => [...followers, ...results.data.data]);
            } catch (err) {}
        }
    }

    const fetchDataFollowing = async (id) => {
        if (!finishedFollowing) {
            try {
                const results = await userAPI.get(`/${userID}/following?id=${id}`);
    
                if (results.data.data.length === 0) {
                    setFinishedFollowing(true)
                }

                setFollowing(following => [...following, ...results.data.data]);
            } catch (err) {}
        }
    }

    window.onscroll = function() {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            if (accountDisplay && created.length !== 0) {
                {fetchDataCreated(created[created.length-1].createdRecipes.createdAt)}
            } 
            
            if (followingDisplay && following.length !== 0) {
                {fetchDataFollowing(following[following.length-1].followingUsers._id)}
            }

            if (followersDisplay && followers.length !== 0) {
                {fetchDataFollowers(followers[followers.length-1].followerUsers._id)}
            }
        }
    };

    return (
        <div className="mainBody">
            {loaded &&
                <>
                    {accountDisplay &&
                        <>
                            <div style={{display: "flex"}}>
                                <p>MY ACCOUNT</p>
                                <p onClick={() => {changeSelection("following")}}>Following</p>
                                <p onClick={() => {changeSelection("followers")}}>Followers</p>
                            </div>
                            <div className="accountUserInformation">
                                <img src={"https://via.placeholder.com/250"} alt="User Avatar" style={{marginLeft: 15}} />
                                <div>
                                    <p className="text1" style={{marginLeft: 30, marginBottom: 0, marginTop: 0}}>{user.name}</p>
                                    <p className="text5" style={{marginLeft: 30}}>{"Joined " + user.date}</p>
                                </div>
                                <div  style={{display: "flex", marginTop: -5, marginLeft: "auto"}}>
                                    <p className="text4" style={{marginLeft: 30}}>{following.length + " Following"}</p>
                                    <p className="text4" style={{marginLeft: 30}}>{followers.length + " Followers"}</p>
                                    <p className="text4" style={{marginLeft: 30}}>{created.length + " Recipes"}</p>
                                </div>
                            </div>
                            <p className="text2" style={{marginLeft: 15, marginTop: 50}}>Their Recipes</p>
                            {created.length > 0 ?
                                <>
                                    <div className="homeRecipesRow">
                                        { created && created.map((recipeReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.createdRecipes._id}`} key={i}>
                                                    <SmallCard recipeReducer={recipeReducer.createdRecipes} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        {finishedFollowers ?
                                            <p className="text4">You Have Reached the End!</p>
                                            :
                                            <p className="text4">Load More!</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">{user.name + " Hasn't Created Any Recipes!"}</p>
                                </div>
                            }
                        </>
                    }
                    {followingDisplay &&
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={() => {changeSelection("account")}}>My Account</p>
                                <p>FOLLOWING</p>
                                <p onClick={() => {changeSelection("followers")}}>Followers</p>
                            </div>
                            <p className="text2" style={{marginLeft: 15, marginTop: 50}}>Following</p>
                            {following.length > 0 ?
                                <>
                                    <div className="homeRecipesRow">
                                        { following && following.map((userReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/user/${userReducer.followingUsers._id}`} key={i}>
                                                    <UserCard userReducer={userReducer.followingUsers.name} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        {finishedFollowers ?
                                            <p className="text4">You Have Reached the End!</p>
                                            :
                                            <p className="text4">Load More!</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">{user.name + " Isn't Following Anyone!"}</p>
                                </div>
                            }
                        </>
                    }
                    {followersDisplay &&
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={() => {changeSelection("account")}}>My Account</p>
                                <p onClick={() => {changeSelection("following")}}>Following</p>
                                <p>FOLLOWERS</p>
                            </div>
                            <p className="text2" style={{marginLeft: 15, marginTop: 50}}>Followers</p>
                            {followers.length > 0 ?
                                <>
                                    <div className="homeRecipesRow">
                                        { followers && followers.map((userReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/user/${userReducer.followerUsers._id}`} key={i}>
                                                    <UserCard userReducer={userReducer.followerUsers.name} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        {finishedFollowers ?
                                            <p className="text4">You Have Reached the End!</p>
                                            :
                                            <p className="text4">Load More!</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">{user.name + " Doesn't Have Any Followers!"}</p>
                                </div>
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}

export default Account
