import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from "react-router-dom"
import authAPI from "../API/auth"
import { CurrentUserContext } from '../Contexts/currentUserContext';
const moment = require('moment');

const SignIn = ({setMessage}) => {
    const [signin, setSignin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signinEmail, setSigninEmail] = useState("samantha.dickens@email.com");
    const [signinPassword, setSigninPassword] = useState("password");
    const [errors, setErrors] = useState({email: undefined, password: undefined});
    const {changeCurrentUser} = useContext(CurrentUserContext);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authAPI.get(`/`);

                if (response.data.user) {
                    history.push('/');
                }
            } catch (err) {}
        }
        fetchData();
    }, []);

    const createUser = async (e) => {
        e.preventDefault();
        e.target.reset();

        try {
            const createResponse = await authAPI.post("/signup", 
            {
                picture: "default.png",
                name: name,
                email: email,
                password: password,
                date: moment().format('DD/MM/YYYY'),
                followers: [],
                following: [], 
                saved_recipes: [],
                created_recipes: []
            });

            if (createResponse.data.data && typeof window !== 'undefined') {
                changeCurrentUser({
                    id: createResponse.data.data
                })

                setMessage("Account Created!")
        
                window.location = "/"
            }
        } catch (err) {}
    }

    const signinUser = async (e) => {
        e.preventDefault();

        try {
            const signinResponse = await authAPI.post("/signin", 
            {
                email: signinEmail,
                password: signinPassword
            });

            if (signinResponse.data.data && typeof window !== 'undefined') {
                changeCurrentUser({
                    id: signinResponse.data.data
                })

                window.location = "/"
            }
        } catch (err) {
            setErrors(err.response.data.errors);
        }
    }
    
    return (
        <>
            {signin ?
                <div className="middleBody">
                    <form className="signinBody" method="POST" onSubmit={signinUser}>
                        <p className="marginText text2">Welcome back!</p>
                        <div className="multipleInput">
                            <input className="textInputSignin text5" type="text" name="email" placeholder="Email" value={signinEmail} onChange={e => {setSigninEmail(e.target.value)}} />
                            {errors.email && <p className="displayError text5" className="marginText text5">{errors.email}</p> }
                            <input className="textInputSignin text5" type="password" name="password" placeholder="Password" value={signinPassword} onChange={e => {setSigninPassword(e.target.value)}} />
                            {errors.password && <p className="displayError text5" className="marginText text5">{errors.password}</p> }
                        </div>
                        <div className="formSubmit">
                            <input className="signinButton text4" type="submit" value="Sign in" />
                            <button className="noAccountButton text5" type="button" onClick={e => {setSignin(false)}}>Create an account</button>
                        </div>
                    </form>
                </div>
            :
                <div className="middleBody">
                    <form className="signinBody" method="POST" onSubmit={createUser}>
                        <p className="marginText text2">Share your cooking with the world!</p>
                        <div className="multipleInput">
                            <input className="textInputSignin text5" type="text" name="name" placeholder="Name" value={name} onChange={e => {setName(e.target.value)}} />
                            <input className="textInputSignin text5" type="text" name="email" placeholder="Email" value={email} onChange={e => {setEmail(e.target.value)}} />
                            <input className="textInputSignin text5" type="password" name="password" placeholder="Password" value={password} onChange={e => {setPassword(e.target.value)}} />
                        </div>
                        <div className="formSubmit">
                            <input className="createAccountButton text4" type="submit" value="Create account" />
                            <button className="alreadyAccountButton text5" type="button" onClick={e => {setSignin(true)}}>Already have an account?</button>
                        </div>
                    </form>
                </div>
            }
        </>
    )
}

export default SignIn
