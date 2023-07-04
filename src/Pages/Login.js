import React, {useState, useContext} from 'react'
import LSimg from '../Images/LSimg.png'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App';

export default function Login() {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [redirect, setredirect] = useState(false);
    const {userinformation, setuserinformation} = useContext(UserContext);

    async function login(){
        const responce = await fetch(`${process.env.REACT_APP_APIPORT}/login`, {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-type':'application/json'},
        })
        if(responce.ok){
            // do someting with the usercontext or cookie
            setredirect(true);
        }
    }

    if(redirect){
        return <Navigate to='/lobby'></Navigate>
    }

    return (
        <div className='LSbg'>
            <div className='LSform'>
                <div className='LSleft'>
                    <h2>Log in</h2>
                    <span>Username:</span>
                    <input placeholder='username' type='text' value={username} onChange={e => setusername(e.target.value)}/>
                    <span>Password:</span>
                    <input placeholder='password' type='password' value={password} onChange={e=> setpassword(e.target.value)}/>
                    <button onClick={login}>Login</button>
                </div>
                <img src={LSimg} alt='login/signup img'></img>
            </div>
        </div>
    )
}
