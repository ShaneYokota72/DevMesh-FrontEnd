import React, {useContext, useState} from 'react'
import devlogo from '../Images/DevLogo.png'
import { Link, Navigate } from 'react-router-dom'
import {UserContext} from '../App';
import Toggle from 'react-toggle'

export default function Navbar() {
    const [redirect, setredirect] = useState(false);
    const {theme, setTheme} = useContext(UserContext);

    function handlethemechange(){
        if(theme === 'light'){
            setTheme('dark');
        }
        else{
            setTheme('light');
        }
    }
    function handleRedirect(){
        setredirect(true);
    }
    if(redirect){
        setredirect(false);
        return <Navigate to='/'></Navigate>;
    }
    return (
        <nav className='navbar'>
            <img src={devlogo} alt='DevMesh Logo' onClick={handleRedirect}></img>
            <div className='account'>
                <Toggle
                    id='cheese-status'
                    onChange={handlethemechange}
                    icons={{ checked: "🌙", unchecked: "🔆" }}
                    aria-label="Dark mode toggle" />
                <Link to='/login' className='redirectlink' style={{fontSize:'20px'}}>Log In</Link>
                <Link to='/singup' className='redirectlink' style={{fontSize:'20px'}}>Sign Up</Link>
            </div>
        </nav>
    )
}
