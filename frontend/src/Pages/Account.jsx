import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from "react-router-dom"
import userAPI from "../API/user"
import UserCard from "../Components/User-Card"
import SmallCard from "../Components/Small-Card"
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

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
    const [followed, setFollowed] = useState();
    const [mobile, setMobile] = useState(window.innerWidth < 1051);
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
                if (!user.data.user) {
                    setFollowed(user.data.followed);
                } else {
                    history.replace('/my-profile');
                }
                setFollowers(followers.data.data);
                setFollowing(following.data.data);
                setCreated(created.data.data);
                setLoaded(true);
            } catch (err) {
                history.replace('/');
            }
        }
        fetchDataInitial();
    }, [])

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    const updateMedia = () => {
        setMobile(window.innerWidth < 1051);
    };

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

    const handleFollow = async () => {
        if (followed) {
            try {
                await userAPI.put(`/${user._id}/followers`, {
                    remove: true
                })

                await userAPI.put(`/profile?update=following`, {
                    id: user._id,
                    remove: true
                })
            } catch (err) {}
        } else {
            try {
                await userAPI.put(`/${user._id}/followers`, {
                    remove: false
                })

                await userAPI.put(`/profile?update=following`, {
                    id: user._id,
                    remove: false
                })
            } catch (err) {}
        }
        setFollowed(followed => !followed)
    }

    const loadMore = () => {
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

    return (
        <div className="mainBody">
            {loaded &&
                <>
                    {accountDisplay &&
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem">OVERVIEW</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("following")}}>Following</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("followers")}}>Followers</p>
                            </div>
                            <div className="accountUserInformation">
                                <img src={`http://localhost:5000/uploads/${user.picture}`} className="marginText img4" alt="User Avatar" />
                                <div>
                                    {mobile &&
                                        <div className="accountInformation text4">
                                            <p className="accountInformationItem">{following.length + " Following"}</p>
                                            <p className="accountInformationItem">{followers.length + " Followers"}</p>
                                            <p className="accountInformationItem">{created.length + " Recipes"}</p>
                                        </div>
                                    }  
                                    <div className="accountUserName">
                                        <p className="accountName text1">{user.name}</p>
                                        <>
                                            {followed ?
                                                <button className="followUserButton"
                                                        onClick={() => {handleFollow()}}>
                                                            <FavoriteIcon style={{fontSize: 20, color: "#FFFFFF", marginRight: 7, marginLeft: 7}} />
                                                            <p className="followUserText text4">Unfollow</p>
                                                </button>
                                            :
                                                <button className="followUserButton"
                                                        onClick={() => {handleFollow()}}>
                                                            <FavoriteBorderIcon style={{fontSize: 20, color: "#FFFFFF", marginRight: 7, marginLeft: 7}} />
                                                            <p className="followUserText text4">Follow</p>
                                                </button>
                                            }
                                        </>
                                    </div>
                                    <p className="accountJoined text5">{"Joined " + user.date}</p>
                                </div>
                                {!mobile &&
                                    <div className="accountInformation text4">
                                        <p className="accountInformationItem">{following.length + " Following"}</p>
                                        <p className="accountInformationItem">{followers.length + " Followers"}</p>
                                        <p className="accountInformationItem">{created.length + " Recipes"}</p>
                                    </div>
                                }   
                            </div>
                            <p className="accountCreatedRecipes text2">Their recipes</p>
                            {created.length > 0 ?
                                <>
                                    <div className="recipesRow">
                                        { created && created.map((recipeReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.createdRecipes._id}`} key={i}>
                                                    <SmallCard recipeReducer={recipeReducer.createdRecipes} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        {finishedCreated ?
                                            <p className="text4">You have reached the end!</p>
                                            :
                                            <p className="loadMore text4" onClick={() => {loadMore()}}>Load more</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">{user.name + " hasn't created any recipes!"}</p>
                                </div>
                            }
                        </>
                    }
                    {followingDisplay &&
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem" onClick={() => {changeSelection("account")}}>Overview</p>
                                <p className="accountNavigationItem">FOLLOWING</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("followers")}}>Followers</p>
                            </div>
                            {following.length > 0 ?
                                <>
                                    <div className="recipesRow">
                                        { following && following.map((userReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/user/${userReducer.followingUsers._id}`} key={i}>
                                                    <UserCard userReducer={userReducer.followingUsers} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        {finishedFollowing ?
                                            <p className="text4">You have reached the end!</p>
                                            :
                                            <p className="loadMore text4" onClick={() => {loadMore()}}>Load more</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">{user.name + " isn't following anyone!"}</p>
                                </div>
                            }
                        </>
                    }
                    {followersDisplay &&
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem" onClick={() => {changeSelection("account")}}>Overview</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("following")}}>Following</p>
                                <p className="accountNavigationItem">FOLLOWERS</p>
                            </div>
                            {followers.length > 0 ?
                                <>
                                    <div className="recipesRow">
                                        { followers && followers.map((userReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/user/${userReducer.followerUsers._id}`} key={i}>
                                                    <UserCard userReducer={userReducer.followerUsers} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        {finishedFollowers ?
                                            <p className="text4">You have reached the end!</p>
                                            :
                                            <p className="loadMore text4" onClick={() => {loadMore()}}>Load more</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">{user.name + " doesn't have any followers!"}</p>
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
