import React, {useState, useEffect} from 'react'
import {Link, useHistory} from "react-router-dom"
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
    const history = useHistory();

    useEffect(() => {
        const fetchDataInitial = async () => {
            try {
                const response = await userAPI.get(`/profile`);

                if (response.data.user) {
                    const feed = await userAPI.get("/feed");
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

    const uploadPicture = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('picture', pictureFile);

        const uploadResponse = await imageAPI.post("/upload", formData);

        setPictureName(uploadResponse.data.data);
    }

    const removePicture = async () => {
        if (pictureFile !== "") {
            await imageAPI.put('/remove', {picture: pictureName});
            setPictureFile("");
            setPictureName(user.picture);
        }
    }

    const updateUser = async (e) => {
        e.preventDefault();
        e.target.reset();
        
        if (pictureName !== user.picture && pictureName !== "default.png") {
            await imageAPI.put('/remove', {picture: user.picture});
        }

        await userAPI.put(`/${user._id}?update=all`, 
        {
            picture: pictureName,
            name: user.name,
            email: user.email,
            password: password,
            date: user.date,
            followers: user.followers,
            following: user.following,
            saved_recipes: user.saved_recipes,
            created_recipes: user.created_recipes
        });

        setPassword("");
        setPictureName("");
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

            if (savedDisplay && saved.length !== 0) {
                {fetchDataSaved(saved[saved.length-1].savedRecipes.createdAt)}
            }
        }
    }

    return (
        <div className="mainBody">
            {loaded &&
                <>
                    {accountDisplay &&
                        <>
                            <div style={{display: "flex"}}>
                                <p>MY ACCOUNT</p>  
                                <p onClick={() => {changeSelection("feed")}}>My Feed</p>
                                <p onClick={() => {changeSelection("saved")}}>Saved Recipes</p>
                                <p onClick={() => {changeSelection("following")}}>Following</p>
                                <p onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p onClick={() => {changeSelection("settings")}}>Settings</p>
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
                            <p className="text2" style={{marginLeft: 15, marginTop: 50}}>My Recipes</p>
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
                                        {finishedCreated ?
                                            <p className="text4">You Have Reached the End!</p>
                                            :
                                            <p className="text4">Load More!</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">You Haven't Created Any Recipes!</p>
                                </div>
                            }
                        </>
                    }
                    {feedDisplay &&
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={() => {changeSelection("account")}}>My Account</p>
                                <p>MY FEED</p>
                                <p onClick={() => {changeSelection("saved")}}>Saved Recipes</p>
                                <p onClick={() => {changeSelection("following")}}>Following</p>
                                <p onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p onClick={() => {changeSelection("settings")}}>Settings</p>
                            </div>
                            <p className="text2" style={{marginLeft: 15, marginTop: 50}}>My Feed</p>
                            <Link className="homeLink text6" to="/my-feed">See More</Link>
                            {feed.length > 0 ?
                                <div className="homeRecipesRow">
                                    { feed && feed.map((recipeReducer, i) => {
                                        return (
                                            <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.feedRecipes}`} key={i}>
                                                <SmallCard recipeReducer={recipeReducer.feedRecipes} />
                                            </Link>
                                        )
                                    })}
                                </div>
                            :
                                <div className="finished">
                                    <p className="text4">Your Feed is Empty!</p>
                                </div>
                            }
                        </>
                    }
                    {savedDisplay &&
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={() => {changeSelection("account")}}>My Account</p>
                                <p onClick={() => {changeSelection("feed")}}>My Feed</p>
                                <p>SAVED RECIPES</p>
                                <p onClick={() => {changeSelection("following")}}>Following</p>
                                <p onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p onClick={() => {changeSelection("settings")}}>Settings</p>
                            </div>
                            <p className="text2" style={{marginLeft: 15, marginTop: 50}}>Saved Recipes</p>
                            {saved.length > 0 ?
                                <>
                                    <div className="homeRecipesRow">
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
                                            <p className="text4">You Have Reached the End!</p>
                                            :
                                            <p className="text4">Load More!</p>
                                        }
                                    </div>
                                </>
                            :
                                <div className="finished">
                                    <p className="text4">Your Saved Recipes is Empty!</p>
                                </div>
                            }
                        </>
                    }
                    {followingDisplay &&
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={() => {changeSelection("account")}}>My Account</p>
                                <p onClick={() => {changeSelection("feed")}}>My Feed</p>
                                <p onClick={() => {changeSelection("saved")}}>Saved Recipes</p>
                                <p>FOLLOWING</p>
                                <p onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p onClick={() => {changeSelection("settings")}}>Settings</p>
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
                                    <p className="text4">You Aren't Following Anyone!</p>
                                </div>
                            }
                        </>
                    }
                    {followersDisplay &&
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={() => {changeSelection("account")}}>My Account</p>
                                <p onClick={() => {changeSelection("feed")}}>My Feed</p>
                                <p onClick={() => {changeSelection("saved")}}>Saved Recipes</p>
                                <p onClick={() => {changeSelection("following")}}>Following</p>
                                <p>FOLLOWERS</p>
                                <p onClick={() => {changeSelection("settings")}}>Settings</p>
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
                                    <p className="text4">You Don't Have Any Followers!</p>
                                </div>
                            }
                        </>
                    }
                    {settingsDisplay &&
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={() => {changeSelection("account")}}>My Account</p>
                                <p onClick={() => {changeSelection("feed")}}>My Feed</p>
                                <p onClick={() => {changeSelection("saved")}}>Saved Recipes</p>
                                <p onClick={() => {changeSelection("following")}}>Following</p>
                                <p onClick={() => {changeSelection("followers")}}>Followers</p>
                                <p>SETTINGS</p>
                            </div>
                            <p className="text2" style={{marginLeft: 15, marginTop: 50}}>Settings</p>
                            <form method="POST" onSubmit={uploadPicture} encType="multipart/form-data">
                                <div>
                                    <input type="file" name="picture" onChange={e => {setPictureFile(e.target.files[0])}} />
                                </div>
                                <div>
                                    <input type="submit" value="Upload Image" />
                                </div>
                            </form>
                            <button onClick={() => {removePicture()}}>Remove</button>
                            <form method="POST" onSubmit={updateUser}>
                                <div>
                                    <input type="text" name="password" placeholder="password" onChange={e => {setPassword(e.target.value)}} />
                                </div>
                                <div>
                                    <input type="submit" value="Save Changes" />
                                </div>
                            </form>
                        </>
                    }
                </>
            }
        </div>
    )
}

export default Profile
