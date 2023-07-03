import React, {useState} from 'react'
import devlogo from '../Images/DevLogo.png'
import { Link, Navigate } from 'react-router-dom'

export default function Navbar() {
    const [redirect, setredirect] = useState(false);
    function handleRedirect(){
        setredirect(true);
    }
    if(redirect){
        setredirect(false);
        return <Navigate to='/'></Navigate>;
    }
    return (
        <nav className='navbar'>
            <img src={devlogo} onClick={handleRedirect}></img>
            <div className='account'>
                <Link to='/login' className='redirectlink' style={{fontSize:'20px'}}>Log In</Link>
                <Link to='/singup' className='redirectlink' style={{fontSize:'20px'}}>Sign Up</Link>
            </div>
        </nav>
    )
}
