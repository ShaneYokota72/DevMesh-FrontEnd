import React, {useState, useContext} from 'react'
import LSimg from '../Images/LSimg.png'
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../App';

export default function Login() {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [redirect, setredirect] = useState(false);
    const {setuserinformation} = useContext(UserContext);

    async function login(){
        if(username === '' || password === ''){
            alert('Please fill out all the information');
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_APIPORT}/login`, {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-type':'application/json'},
        })
        const data = await response.json();
        if(response.ok){
            setuserinformation(data);
            setredirect(true);
        } else {
            alert(data);
        }
    }

    const handleKeyPress = (e) => {
        if (e.code === "Enter") {
            login();
        }
    };

    if(redirect){
        return <Navigate to='/lobby'></Navigate>
    }

    return (
        <div className='LSbg'>
            <div className='LSform'>
                <div className='LSleft'>
                    <h2>Log in</h2>
                    <span>Username:</span>
                    <input placeholder='username' type='text' onKeyDown={handleKeyPress} value={username} onChange={e => setusername(e.target.value)}/>
                    <span>Password:</span>
                    <input placeholder='password' type='password' onKeyDown={handleKeyPress} value={password} onChange={e=> setpassword(e.target.value)}/>
                    <button onClick={login}>Login</button>
                    <h5>Dont have an account? <Link to='/signup'>Sign Up</Link></h5>
                </div>
                <img src={LSimg} alt='login/signup img'></img>
            </div>
        </div>
    )
}
