import React, {useContext, useEffect, useState} from 'react'
import devlogo from '../Images/DevLogo.png'
import { Link, Navigate } from 'react-router-dom'
import {UserContext} from '../App';
import Toggle from 'react-toggle'

export default function Navbar() {
    const [redirect, setredirect] = useState(false);
    const {theme, setTheme ,setuserinformation} = useContext(UserContext);

    useEffect(() => {
        //check authentication status
        async function checkstatus(){
            const response = await fetch(`${process.env.REACT_APP_APIPORT}/auth/status`, {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-type':'application/json'},
            })
            const data = await response.json();
            if(response.ok){
                console.log("data", data)
                setuserinformation(data);
            }
            return;
        }
        checkstatus();
    }, [setuserinformation])

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
                    onChange={handlethemechange}
                    icons={{ checked: "🌙", unchecked: "🔆" }}
                    aria-label="Dark mode toggle" />
                <Link to='/lobby' className='redirectlink'>Get Started</Link>
            </div>
        </nav>
    )
}
