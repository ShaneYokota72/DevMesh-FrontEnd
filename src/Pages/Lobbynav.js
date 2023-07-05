import React, {useContext, useState} from 'react'
import devlogo from '../Images/DevLogo.png'
import { Navigate } from 'react-router-dom'
import {UserContext} from '../App';
import Toggle from 'react-toggle'

export default function Lobbynav() {
    const [redirect, setredirect] = useState(false);
    const {theme, setTheme, userinformation, setuserinformation} = useContext(UserContext);
    const [createform, setcreateform] = useState(false);
    const [joinform, setjoinform] = useState(false);
    const [newroomid, setnewroomid] = useState(''); 
    const [gotonewroom, setgotonewroom] = useState(false);

    /* Form related variables */
    const [ispublic, setispublic] = useState(null);
    const [tags, settags] = useState('');
    const [desc, setdesc] = useState('');
    const [roomid, setroomid] = useState('');

    async function logout(){
        const response = await fetch(`${process.env.REACT_APP_APIPORT}/logout`, {
            method: 'POST',
            headers: {'Content-type':'application/json'},
        })
        if(response.ok){
            setuserinformation({});
            setredirect(true);
        }
    }

    async function createroom(){
        if(ispublic === null || tags === '' || desc === ''){
            alert('Please fill out all the information');
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_APIPORT}/createroom`, {
            method: 'POST',
            body: JSON.stringify({
                creater: userinformation._id,
                creatername: userinformation.displayname,
                ispublic, 
                tags, 
                desc
            }),
            headers: {'Content-type':'application/json'},
            credentials: 'include',
        })
        const data = await response.json();
        if(response.ok){
            setnewroomid(data._id);
            setgotonewroom(true);
        }
    }

    async function joinroom(){

    }

    if(gotonewroom){
        return <Navigate to={`/room/${newroomid}`}></Navigate>
    }

    function handlethemechange(){
        if(theme === 'light'){
            setTheme('dark');
        }
        else{
            setTheme('light');
        }
    }
    function handlecreateform(){
        if(joinform){
            setjoinform(!joinform);
        }
        setcreateform(!createform);
    }
    function handlejoinform(){
        if(createform){
            setcreateform(!createform);
        }
        setjoinform(!joinform);
    }

    function handleRedirect(){
        setredirect(true);
    }

    if(redirect){
        return <Navigate to={'/'}></Navigate>
    }
    return (
        <>
            <nav className='navbar' id='lobbynav'>
                <img src={devlogo} alt='DevMesh Logo' onClick={handleRedirect}></img>
                <div className='lobbyacc'>
                    <h5 className='welcomemsg'>{`Welcome ${userinformation.displayname}`}</h5>
                    <Toggle
                        onChange={handlethemechange}
                        icons={{ checked: "🌙", unchecked: "🔆" }}
                        aria-label="Dark mode toggle" />
                    <h5 className='redirectlink' style={{fontSize:'20px'}} onClick={handlecreateform}>Create</h5>
                    <h5 className='redirectlink' style={{fontSize:'20px'}} onClick={handlejoinform}>Join</h5>
                    <h5 className='redirectlink' style={{fontSize:'20px'}} onClick={logout}>Log Out</h5>
                </div>
            </nav>
            {createform? 
                (
                    <div className='cjform'> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="popupX" onClick={handlecreateform} viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        <h1>Create Room</h1>
                        <div className='roomtype'>
                            <span>Rooom Type: </span>
                            <input type="radio" value={ispublic} name='roomtype' onClick={()=>setispublic(true)}/> <span>Public </span>
                            <input type="radio" value={ispublic} name='roomtype' onClick={()=>setispublic(false)}/> <span>Private </span>
                        </div>
                        <span>Tags</span>
                        <input className='forminputtext' style={{width: "15vw", marginTop:"-1vh"}} type='text' value={tags} onChange={e => settags(e.target.value)} placeholder='tag1, tag2, tag3'></input>
                        <span>Description</span>
                        <input className='forminputtext' style={{width: "30vw", marginTop:"-1vh"}} type='text' value={desc} onChange={e => setdesc(e.target.value)} placeholder='description'></input>
                        <button onClick={createroom}>Create Room</button>
                    </div>
                ) : (
                    null
                )
            }
            {joinform? 
                (
                    <div className='cjform' style={{gap: "3vw"}}> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="popupX" onClick={handlejoinform} viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        <h1 style={{margin: "0"}}>Join Room</h1>
                        <div className='roomtype'>
                            <span>devmesh.vercel/app/ </span>
                            <input className='forminputtext' style={{width: "15vw", margin: "0"}} type='text' value={roomid} onChange={e => setroomid(e.target.value)} placeholder='roomid'></input>
                        </div>
                        <button onClick={joinroom} style={{marginTop: "1vh"}}>Join Room</button>
                    </div>
                ) : (
                    null
                )
            }
        </>
    )
}
