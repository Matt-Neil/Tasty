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
    const [loaded, setLoaded] = useState(false);
    const [feed, setFeed] = useState(false);
    const [saved, setSaved] = useState(false);
    const [account, setAccount] = useState(true);
    const [following, setFollowing] = useState(false);
    const [followers, setFollowers] = useState(false);
    const [settings, setSettings] = useState(false);
    const [password, setPassword] = useState("");
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userAPI.get(`/user`);

                if (response.data.user) {
                    setUser(response.data.data);
                    setLoaded(true);
                } else {
                    history.push('/sign-in');
                }
            } catch (err) {}
        }
        fetchData();
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
        
        if (pictureName !== user.picture && pictureName !== "default.png") {
            await imageAPI.put('/remove', {picture: user.picture});
        }

        await userAPI.put(`/${user._id}?update=all`, 
        {
            picture: pictureName,
            name: "Connor Gate",
            email: "connor.gate@email.com",
            password: password,
            date: "11/06/2021",
            followers: [],
            following: ["610771867f9fa71a7d20d9f2", "610c03ce17c86b33bdb99000"],
            saved_recipes: [],
            created_recipes: []
        });

        setPassword("");
        setPictureName("");
    }

    const changeSelection = (selection) => {
        switch (selection) {
            case "feed":
                setFeed(true);
                setSaved(false);
                setAccount(false);
                setFollowing(false);
                setFollowers(false);
                setSettings(false);
                break;
            case "saved":
                setFeed(false);
                setSaved(true);
                setAccount(false);
                setFollowing(false);
                setFollowers(false);
                setSettings(false);
                break;
            case "account":
                setFeed(false);
                setSaved(false);
                setAccount(true);
                setFollowing(false);
                setFollowers(false);
                setSettings(false);
                break;
            case "following":
                setFeed(false);
                setSaved(false);
                setAccount(false);
                setFollowing(true);
                setFollowers(false);
                setSettings(false);
                break;
            case "followers":
                setFeed(false);
                setSaved(false);
                setAccount(false);
                setFollowing(false);
                setFollowers(true);
                setSettings(false);
                break;
            case "settings":
                setFeed(false);
                setSaved(false);
                setAccount(false);
                setFollowing(false);
                setFollowers(false);
                setSettings(true);
                break;
            default:
                setFeed(false);
                setSaved(false);
                setAccount(true);
                setFollowing(false);
                setFollowers(false);
                setSettings(false);
                break;
        }
    }

    return (
        <div className="mainBody">
            {loaded ?
                <>
                    {feed ?
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={e => {changeSelection("feed")}}>MY FEED</p>
                                <p onClick={e => {changeSelection("saved")}}>Saved Recipes</p>
                                <p onClick={e => {changeSelection("account")}}>My Account</p>
                                <p onClick={e => {changeSelection("following")}}>Following</p>
                                <p onClick={e => {changeSelection("followers")}}>Followers</p>
                                <p onClick={e => {changeSelection("settings")}}>Settings</p>
                            </div>
                            <div className="homeRecipesRow">
                                { user.created_recipes && user.created_recipes.map((recipeReducer, i) => {
                                    return (
                                        <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.title}`} key={i}>
                                            <SmallCard recipeReducer={recipeReducer} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </>
                        :
                        null
                    }
                    {saved ?
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={e => {changeSelection("feed")}}>My Feed</p>
                                <p onClick={e => {changeSelection("saved")}}>SAVED RECIPES</p>
                                <p onClick={e => {changeSelection("account")}}>My Account</p>
                                <p onClick={e => {changeSelection("following")}}>Following</p>
                                <p onClick={e => {changeSelection("followers")}}>Followers</p>
                                <p onClick={e => {changeSelection("settings")}}>Settings</p>
                            </div>
                            <div className="homeRecipesRow">
                                { user.saved_recipes && user.saved_recipes.map((recipeReducer, i) => {
                                    return (
                                        <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.title}`} key={i}>
                                            <SmallCard recipeReducer={recipeReducer} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </>
                        :
                        null
                    }
                    {account ?
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={e => {changeSelection("feed")}}>My Feed</p>
                                <p onClick={e => {changeSelection("saved")}}>Saved Recipes</p>
                                <p onClick={e => {changeSelection("account")}}>MY ACCOUNT</p>
                                <p onClick={e => {changeSelection("following")}}>Following</p>
                                <p onClick={e => {changeSelection("followers")}}>Followers</p>
                                <p onClick={e => {changeSelection("settings")}}>Settings</p>
                            </div>
                            <div className="accountUserInformation">
                                <img src={"https://via.placeholder.com/250"} alt="User Avatar" style={{marginLeft: 15}} />
                                <div>
                                    <p className="text1" style={{marginLeft: 30, marginBottom: 0, marginTop: 0}}>{user.name}</p>
                                    <p className="text5" style={{marginLeft: 30}}>{"Joined " + user.date}</p>
                                </div>
                                <div  style={{display: "flex", marginTop: -5, marginLeft: "auto"}}>
                                    <p className="text4" style={{marginLeft: 30}}>{user.following.length + " Following"}</p>
                                    <p className="text4" style={{marginLeft: 30}}>{user.followers.length + " Followers"}</p>
                                    <p className="text4" style={{marginLeft: 30}}>{user.created_recipes.length + " Recipes"}</p>
                                </div>
                            </div>
                            <p className="text2" style={{marginLeft: 15, marginTop: 50}}>My Recipes</p>
                            <div className="homeRecipesRow">
                                { user.created_recipes && user.created_recipes.map((recipeReducer, i) => {
                                    return (
                                        <Link className={"recipeLinkSmall"} to={`/recipes/${recipeReducer.title}`} key={i}>
                                            <SmallCard recipeReducer={recipeReducer} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </>
                        :
                        null
                    }
                    {following ?
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={e => {changeSelection("feed")}}>My Feed</p>
                                <p onClick={e => {changeSelection("saved")}}>Saved Recipes</p>
                                <p onClick={e => {changeSelection("account")}}>My Account</p>
                                <p onClick={e => {changeSelection("following")}}>FOLLOWING</p>
                                <p onClick={e => {changeSelection("followers")}}>Followers</p>
                                <p onClick={e => {changeSelection("settings")}}>Settings</p>
                            </div>
                            <div className="homeRecipesRow">
                                { user.following && user.following.map((userReducer, i) => {
                                    return (
                                        <Link className={"recipeLinkSmall"} to={`/user/${userReducer}`} key={i}>
                                            <UserCard userReducer={userReducer} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </>
                        :
                        null
                    }
                    {followers ?
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={e => {changeSelection("feed")}}>My Feed</p>
                                <p onClick={e => {changeSelection("saved")}}>Saved Recipes</p>
                                <p onClick={e => {changeSelection("account")}}>My Account</p>
                                <p onClick={e => {changeSelection("following")}}>Following</p>
                                <p onClick={e => {changeSelection("followers")}}>FOLLOWERS</p>
                                <p onClick={e => {changeSelection("settings")}}>Settings</p>
                            </div>
                            <div className="homeRecipesRow">
                                { user.followers && user.followers.map((userReducer, i) => {
                                    return (
                                        <Link className={"recipeLinkSmall"} to={`/user/${userReducer}`} key={i}>
                                            <UserCard userReducer={userReducer} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </>
                        :
                        null
                    }
                    {settings ?
                        <>
                            <div style={{display: "flex"}}>
                                <p onClick={e => {changeSelection("feed")}}>My Feed</p>
                                <p onClick={e => {changeSelection("saved")}}>Saved Recipes</p>
                                <p onClick={e => {changeSelection("account")}}>My Account</p>
                                <p onClick={e => {changeSelection("following")}}>Following</p>
                                <p onClick={e => {changeSelection("followers")}}>Followers</p>
                                <p onClick={e => {changeSelection("settings")}}>SETTINGS</p>
                            </div>
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
                        :
                        null
                    }
                </>
            :    
                null
            }
        </div>
    )
}

export default Profile
