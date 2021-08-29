import React, {useState, useEffect} from 'react'
import {Link, useHistory} from "react-router-dom"
import authAPI from "../API/auth"
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close';

const Header = ({setSearchPhrase}) => {
    const [user, setUser] = useState();
    const [search, setSearch] = useState(false);
    const [input, setInput] = useState("");
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authAPI.get(`/`);

                if (response.data.user) {
                    setUser(response.data.data);
                }
            } catch (err) {}
        }
        fetchData();
    }, []);

    const signout = async () => {
        await authAPI.get("/signout");

        if (typeof window !== 'undefined') {
            window.location = `/`
        }
    }

    const searchFunctionKey = (e) => {
        if (e.key === "Enter" && input !== "") {
            setSearchPhrase(input);
            history.push(`/search/${input}`);
        }
    }

    const searchFunctionButton = () => {
        if (input !== "") {
            setSearchPhrase(input);
            history.push(`/search/${input}`);
        }
    }

    const openSearch = () => {
        setSearch(true)
        setInput("")
    }

    return (
        <>
            { !search ?
                <div className="header">
                    <div className="leftHeader">
                        {user ?
                            <>
                                <Link className="accountButton text6" to="/my-profile">{"Hello, " + user.name}</Link>
                                <button onClick={() => {signout()}}>Sign Out</button>
                            </>
                        :
                            <Link className="accountButton text6" to="/sign-in">SIGN IN | REGISTER</Link>
                        }
                    </div>
                    <div className="middleHeader">
                        <Link className="title" to="/">Tasty.</Link>
                    </div>
                    <button className="openSearchButton"
                            onClick={e => openSearch()}><SearchIcon style={{paddingRight: 5, marginTop: 2, fontSize: 30, color: "#3CC5A4"}} />Search</button>
                </div>
            :
                <div className="search">
                    <button className="searchButton"
                            onClick={e => searchFunctionButton()}><SearchIcon fontSize="inherit" style={{marginTop: 7}} /></button>
                    <input placeholder={"Search for recipes, people..."}
                            className={"searchBox text5"}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={searchFunctionKey}
                    />
                    <button className="closeSearchButton"
                            onClick={e => setSearch(false)}><CloseIcon fontSize="inherit" style={{marginTop: 7}} /></button>
                </div>
            }
        </>
        
    )
}

export default Header
