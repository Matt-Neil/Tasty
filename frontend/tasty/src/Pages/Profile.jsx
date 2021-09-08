import React, {useState, useEffect} from 'react'
import {Link, useHistory} from "react-router-dom"
import authAPI from "../API/auth"
import userAPI from "../API/user"
import imageAPI from "../API/image"
import SmallCard from "../Components/Small-Card"
import UserCard from "../Components/User-Card"

const Profile = () => {
    const [pictureFile, setPictureFile] = useState("");
    const [pictureName, setPictureName] = useState("");
    const [user, setUser] = useState();
    const [feed, setFeed] = useState();
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();
    const [created, setCreated] = useState();
    const [saved, setSaved] = useState();
    const [loaded, setLoaded] = useState(false);
    const [feedDisplay, setFeedDisplay] = useState(false);
    const [savedDisplay, setSavedDisplay] = useState(false);
    const [accountDisplay, setAccountDisplay] = useState(true);
    const [followingDisplay, setFollowingDisplay] = useState(false);
    const [followersDisplay, setFollowersDisplay] = useState(false);
    const [settingsDisplay, setSettingsDisplay] = useState(false);
    const [finishedCreated, setFinishedCreated] = useState(false);
    const [finishedFollowers, setFinishedFollowers] = useState(false);
    const [finishedFollowing, setFinishedFollowing] = useState(false);
    const [finishedSaved, setFinishedSaved] = useState(false);
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({password: undefined});
    const [mobile, setMobile] = useState(window.innerWidth < 1051);
    const history = useHistory();

    useEffect(() => {
        const fetchDataInitial = async () => {
            try {
                const response = await userAPI.get(`/profile`);

                if (response.data.user) {
                    const feed = await userAPI.get(`/feed?createdAt=${new Date().toISOString()}`);
                    const followers = await userAPI.get(`/profile/followers`);
                    const following = await userAPI.get(`/profile/following`);
                    const created = await userAPI.get(`/profile/created?date=${new Date().toISOString()}`);
                    const saved = await userAPI.get(`/profile/saved?date=${new Date().toISOString()}`);

                    setUser(response.data.data);
                    setFeed(feed.data.data);
                    setFollowers(followers.data.data);
                    setFollowing(following.data.data);
                    setCreated(created.data.data);
                    setSaved(saved.data.data)
                    setLoaded(true);
                } else {
                    history.replace('/sign-in');
                }
            } catch (err) {}
        }
        fetchDataInitial();
    }, []);

    useEffect(() => {
        if (loaded) {
            setPictureName(user.picture);
            setPassword(user.password)
        }
    }, [loaded]);

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    const updateMedia = () => {
        setMobile(window.innerWidth < 1051);
    };

    const uploadPicture = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('picture', pictureFile);

        const uploadResponse = await imageAPI.post("/upload", formData);

        setPictureName(uploadResponse.data.data);
    }

    const removePicture = async () => {
        try {
            if (pictureFile !== "" && pictureName !== "default.png") {
                await imageAPI.put('/remove', {picture: pictureName});
                setPictureFile("");
                setPictureName(user.picture);
            }
        } catch (err) {}
    }

    const updateUser = async (e) => {
        e.preventDefault();
        e.target.reset();

        try {
            if (pictureName !== user.picture && user.picture !== "default.png") {
                await imageAPI.put('/remove', {picture: user.picture});
            }
    
            await userAPI.put(`/profile?update=all`, 
            {
                picture: pictureName,
                password: password
            });
    
            setPassword("");
            setPictureName(user.picture);
            setErrors();
        } catch (err) {
            setErrors(err.response.data.errors);
        }
    }

    const signout = async () => {
        await authAPI.get("/signout");

        if (typeof window !== 'undefined') {
            window.location = `/`
        }
    }

    const changeSelection = (selection) => {
        switch (selection) {
            case "feed":
                setFeedDisplay(true);
                setSavedDisplay(false);
                setAccountDisplay(false);
                setFollowingDisplay(false);
                setFollowersDisplay(false);
                setSettingsDisplay(false);
                break;
            case "saved":
                setFeedDisplay(false);
                setSavedDisplay(true);
                setAccountDisplay(false);
                setFollowingDisplay(false);
                setFollowersDisplay(false);
                setSettingsDisplay(false);
                break;
            case "account":
                setFeedDisplay(false);
                setSavedDisplay(false);
                setAccountDisplay(true);
                setFollowingDisplay(false);
                setFollowersDisplay(false);
                setSettingsDisplay(false);
                break;
            case "following":
                setFeedDisplay(false);
                setSavedDisplay(false);
                setAccountDisplay(false);
                setFollowingDisplay(true);
                setFollowersDisplay(false);
                setSettingsDisplay(false);
                break;
            case "followers":
                setFeedDisplay(false);
                setSavedDisplay(false);
                setAccountDisplay(false);
                setFollowingDisplay(false);
                setFollowersDisplay(true);
                setSettingsDisplay(false);
                break;
            case "settings":
                setFeedDisplay(false);
                setSavedDisplay(false);
                setAccountDisplay(false);
                setFollowingDisplay(false);
                setFollowersDisplay(false);
                setSettingsDisplay(true);
                break;
            default:
                setFeedDisplay(false);
                setSavedDisplay(false);
                setAccountDisplay(true);
                setFollowingDisplay(false);
                setFollowersDisplay(false);
                setSettingsDisplay(false);
                break;
        }
    }

    const fetchDataCreated = async (date) => {
        if (!finishedCreated) {
            try {
                const results = await userAPI.get(`/profile/created?date=${date}`);
    
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
                const results = await userAPI.get(`/profile/followers?id=${id}`);
    
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
                const results = await userAPI.get(`/profile/following?id=${id}`);
    
                if (results.data.data.length === 0) {
                    setFinishedFollowing(true)
                }

                setFollowing(following => [...following, ...results.data.data]);
            } catch (err) {}
        }
    }

    const fetchDataSaved = async (date) => {
        if (!finishedSaved) {
            try {
                const results = await userAPI.get(`/profile/saved?date=${date}`);
    
                if (results.data.data.length === 0) {
                    setFinishedSaved(true)
                }

                setSaved(saved => [...saved, ...results.data.data]);
            } catch (err) {}
        }
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

        if (savedDisplay && saved.length !== 0) {
            {fetchDataSaved(saved[saved.length-1].savedRecipes.createdAt)}
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
                                <p className="accountNavigationItem" onClick={() => {changeSelection("feed")}}>Your feed</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("saved")}}>Saved recipes</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("following")}}>Following</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("settings")}}>Settings</p>
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
                                        <button onClick={() => {signout()}} className="signoutButton text4">Sign out</button>
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
                            <p className="accountCreatedRecipes text2">Your recipes</p>
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
                                    <p className="text4">You haven't created any recipes!</p>
                                </div>
                            }
                        </>
                    }
                    {feedDisplay &&
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem" onClick={() => {changeSelection("account")}}>Overview</p>
                                <p className="accountNavigationItem">YOUR FEED</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("saved")}}>Saved recipes</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("following")}}>Following</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("settings")}}>Settings</p>
                            </div>
                            {feed.length > 0 ?
                                <>
                                    <div className="recipesRow">
                                        { feed && feed.map((recipeReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.recipe._id}`} key={i}>
                                                    <SmallCard recipeReducer={recipeReducer.recipe} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        <Link className="loadMore text4" to="/my-feed">See more</Link>
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">Your feed is empty!</p>
                                </div>
                            }
                        </>
                    }
                    {savedDisplay &&
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem" onClick={() => {changeSelection("account")}}>Overview</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("feed")}}>Your feed</p>
                                <p className="accountNavigationItem">SAVED RECIPES</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("following")}}>Following</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("settings")}}>Settings</p>
                            </div>
                            {saved.length > 0 ?
                                <>
                                    <div className="recipesRow">
                                        { saved && saved.map((recipeReducer, i) => {
                                            return (
                                                <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.savedRecipes._id}`} key={i}>
                                                    <SmallCard recipeReducer={recipeReducer.savedRecipes} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="finished">
                                        {finishedSaved ?
                                            <p className="text4">You have reached the end!</p>
                                            :
                                            <p className="loadMore text4" onClick={() => {loadMore()}}>Load more</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">Your saved recipes is empty!</p>
                                </div>
                            }
                        </>
                    }
                    {followingDisplay &&
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem" onClick={() => {changeSelection("account")}}>Overview</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("feed")}}>Your feed</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("saved")}}>Saved recipes</p>
                                <p className="accountNavigationItem">FOLLOWING</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("settings")}}>Settings</p>
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
                                    <p className="text4">You aren't following anyone!</p>
                                </div>
                            }
                        </>
                    }
                    {followersDisplay &&
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem" onClick={() => {changeSelection("account")}}>Overview</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("feed")}}>Your feed</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("saved")}}>Saved recipes</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("following")}}>Following</p>
                                <p className="accountNavigationItem">FOLLOWERS</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("settings")}}>Settings</p>
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
                                    <p className="text4">You don't have any followers!</p>
                                </div>
                            }
                        </>
                    }
                    {settingsDisplay &&
                        <>
                            <div className="accountNavigation text3">
                                <p className="accountNavigationItem" onClick={() => {changeSelection("account")}}>Overview</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("feed")}}>Your feed</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("saved")}}>Saved recipes</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("following")}}>Following</p>
                                <p className="accountNavigationItem" onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p className="accountNavigationItem">SETTINGS</p>
                            </div>
                            <div className="middleBody">
                                <div>
                                    <p className="marginText text3">Change profile picture</p>
                                    <img src={`http://localhost:5000/uploads/${pictureName}`} className="img4" alt="User Avatar" style={{marginLeft: 15}} />
                                    <form method="POST" onSubmit={uploadPicture} encType="multipart/form-data">
                                        <div>
                                            <input className="pictureInput" type="file" name="picture" onChange={e => {setPictureFile(e.target.files[0])}} />
                                        </div>
                                        <div>
                                            <input className="pictureUpload text4" type="submit" value="Upload image" />
                                            <button type="button" className="pictureRemove text4" onClick={() => {removePicture()}}>Remove image</button>
                                        </div>
                                    </form>
                                    <p className="marginText text3">Change password</p>
                                    <form method="POST" onSubmit={updateUser}>
                                        <div>
                                            {errors.password && <p className="displayError text5">{errors.password}</p> }
                                            <input className="textInputAccount text5" type="password" name="password" placeholder="New password" onChange={e => {setPassword(e.target.value)}} />
                                        </div>
                                        <div>
                                            <input className="updateAccountButton text4" type="submit" value="Save changes" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    }
                </>
            }
        </div>
    )
}

export default Profile
