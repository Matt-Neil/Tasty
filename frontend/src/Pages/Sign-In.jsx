import React, {useState, useEffect} from 'react'
import {useHistory} from "react-router-dom"
import authAPI from "../API/auth"
const moment = require('moment');

const SignIn = () => {
    const [signin, setSignin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signinEmail, setSigninEmail] = useState("");
    const [signinPassword, setSigninPassword] = useState("");
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

        if (createResponse.data.data.errors) {
            console.log(createResponse.data.data.errors)
        }

        if (createResponse.data.data.user) {
            setName("");
            setEmail("");
            setPassword("");
            setSignin(true);
    
            if (typeof window !== 'undefined') {
                window.location = `/`
            }
        }
    }

    const signinUser = async (e) => {
        e.preventDefault();

        const signinResponse = await authAPI.post("/signin", 
        {
            email: signinEmail,
            password: signinPassword
        });

        if (signinResponse.data.data.errors) {
            console.log(signinResponse.data.data.errors)
        }

        if (signinResponse.data.data.user) {
            setName("");
            setEmail("");
            setPassword("");
            setSignin(true);
    
            if (typeof window !== 'undefined') {
                window.location = `/`
            }
        }
    }
    
    return (
        <div className="mainBody">
            {signin ?
                <>
                    <form method="POST" onSubmit={signinUser}>
                        <div>
                            <input type="text" name="email" placeholder="email" required onChange={e => {setSigninEmail(e.target.value)}} />
                            <input type="password" name="password" placeholder="password" required onChange={e => {setSigninPassword(e.target.value)}} />
                        </div>
                        <div>
                            <input type="submit" value="Sign In" />
                        </div>
                    </form>
                    <button onClick={e => {setSignin(false)}}>Create an Account</button>
                </>
            :
                <>
                    <button onClick={e => {setSignin(true)}}>Already Have an Account?</button>
                    <form method="POST" onSubmit={createUser}>
                        <div>
                            <input type="text" name="name" placeholder="name" onChange={e => {setName(e.target.value)}} />
                            <input type="text" name="email" placeholder="email" onChange={e => {setEmail(e.target.value)}} />
                            <input type="password" name="password" placeholder="password" onChange={e => {setPassword(e.target.value)}} />
                        </div>
                        <div>
                            <input type="submit" value="Create Account" />
                        </div>
                    </form>
                </>
            }
        </div>
    )
}

export default SignIn
