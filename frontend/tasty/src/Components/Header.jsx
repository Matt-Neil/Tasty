import React, {useState, useEffect} from 'react'
import {Link, useHistory} from "react-router-dom"
import authAPI from "../API/auth"
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';

const Header = ({setSearchPhrase, setMessage}) => {
    const [user, setUser] = useState();
    const [loaded, setLoaded] = useState(false);
    const [search, setSearch] = useState(false);
    const [input, setInput] = useState("");
    const [mobile, setMobile] = useState(window.innerWidth < 701);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authAPI.get(`/`);

                if (response.data.user) {
                    setUser(response.data.data);
                }
                setLoaded(true);
            } catch (err) {}
        }
        fetchData();
    }, []);

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    const updateMedia = () => {
        setMobile(window.innerWidth < 701);
    };

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
                        {loaded && 
                            <>
                                {user ?
                                    <>
                                        {mobile ? 
                                            <Link className="accountButton text5" to="/my-profile"><PersonIcon style={{marginLeft: 5, fontSize: 26, color: "#6D6D6D"}} /></Link>
                                        :
                                            <Link className="accountButton text5" to="/my-profile">{"Hello, " + user.name}<ExpandMoreIcon style={{marginLeft: 5, fontSize: 26, color: "#6D6D6D"}} /></Link>
                                        }
                                    </>
                                :
                                    <Link className="accountButton text6" to="/sign-in">SIGN IN | REGISTER</Link>
                                }
                            </>
                        }
                    </div>
                    <div className="middleHeader">
                        <Link className="title" to="/">Tasty.</Link>
                    </div>
                    {mobile ? 
                        <button className="openSearchButton"
                            onClick={e => openSearch()}><SearchIcon style={{paddingRight: 5, marginTop: 2, fontSize: 30, color: "#3CC5A4"}} /></button>
                    :
                        <button className="openSearchButton"
                                onClick={e => openSearch()}><SearchIcon style={{paddingRight: 5, marginTop: 2, fontSize: 30, color: "#3CC5A4"}} />Search</button>
                    }
                </div>
            :
                <div className="search">
                    <button className="searchButton"
                            onClick={e => searchFunctionButton()}><SearchIcon fontSize="inherit" style={{marginTop: 7}} /></button>
                    <input placeholder={"Search for recipes or people..."}
                            className={"searchBox text5"}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={searchFunctionKey}
                            autoFocus
                    />
                    <button className="closeSearchButton"
                            onClick={e => setSearch(false)}><CloseIcon fontSize="inherit" style={{marginTop: 7}} /></button>
                </div>
            }
        </>
        
    )
}

export default Header
