import React from 'react'
import mesh from '../Images/IconMesh.png'
import { Link } from 'react-router-dom'

export default function Land() {
    function scrolltoabout(){
        const desiredHeight = window.innerHeight * 1;

        window.scrollTo({
        top: desiredHeight,
        behavior: 'smooth'
        });
    }
    return (
        <div className='landing'>
            <img src={mesh} alt="mash logo"></img>
            <h1>
            __/\\\\\\\\\\\\_____________________________________/\\\\____________/\\\\_________________________________/\\\_________        
    &nbsp;_\/\\\////////\\\__________________________________\/\\\\\\________/\\\\\\________________________________\/\\\_________       
    &nbsp;&nbsp;_\/\\\______\//\\\_________________________________\/\\\//\\\____/\\\//\\\________________________________\/\\\_________      
    &nbsp;&nbsp;&nbsp;_\/\\\_______\/\\\______/\\\\\\\\____/\\\____/\\\__\/\\\\///\\\/\\\/_\/\\\______/\\\\\\\\____/\\\\\\\\\\__\/\\\_________     
    &nbsp;&nbsp;&nbsp;&nbsp;_\/\\\_______\/\\\____/\\\/////\\\__\//\\\__/\\\___\/\\\__\///\\\/___\/\\\____/\\\/////\\\__\/\\\//////___\/\\\\\\\\\\__    
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_\/\\\_______\/\\\___/\\\\\\\\\\\____\//\\\/\\\____\/\\\____\///_____\/\\\___/\\\\\\\\\\\___\/\\\\\\\\\\__\/\\\/////\\\_   
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_\/\\\_______/\\\___\//\\///////______\//\\\\\_____\/\\\_____________\/\\\__\//\\///////____\////////\\\__\/\\\___\/\\\_  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_\/\\\\\\\\\\\\/_____\//\\\\\\\\\\_____\//\\\______\/\\\_____________\/\\\___\//\\\\\\\\\\___/\\\\\\\\\\__\/\\\___\/\\\_ 
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_\////////////________\//////////_______\///_______\///______________\///_____\//////////___\//////////___\///____\///__
    
            </h1>
            <div className='redirect'>
                <Link to='/' className='redirectlink' onClick={scrolltoabout}>Learn More</Link>
                <Link to='/lobby'className='redirectlink'>Try It Out</Link>
                <Link to='https://youtu.be/-ppDyhM1jH8'className='redirectlink'>See Demo</Link>
            </div>
        </div>
    )
}
