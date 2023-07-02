import React from 'react'
import CodeEditor from './CodeEditor';
import Chat from './Chat';
import { UserContext } from '../App';
import Codesynclogo from './Codesynclogo.png';
import { Navigate, useParams } from 'react-router-dom';

export default function ColabIDE() {
    const {roomid} = useParams();
    const {username, setusername, roomcreater, setroomcreater} = React.useContext(UserContext);
    const [guestname, setguestname] = React.useState('');
    const [landing, setlanding] = React.useState(false);
    const [lobby, setlobby] = React.useState(false);

    function enterroom(){
        if(guestname === '' || guestname === roomcreater){
            alert('Please try another username');
            return;
        }
        setusername(guestname);
    }

    function backtolanding(){
        setroomcreater('');
        setlanding(true);
    }

    function backtolobby(){
        setroomcreater('');
        setlobby(true);
    }
    
    async function deleteroom(rid, uname){
        const responce = await fetch(`${process.env.REACT_APP_APIPORT}/deleteroom/`+rid, {
            method: 'POST',
            body: JSON.stringify({roomid: rid, username: uname}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    if(landing){
        return <Navigate to='/'></Navigate>
    }

    if(lobby){
        deleteroom(roomid, username)
        return <Navigate to='/lobby'></Navigate>
    }

    if(username === ''){
        return(
            <div className='setupusername'>
                <span>Join as: </span><input type='text' placeholder='username' onChange={e => setguestname(e.target.value)}/>

                <svg onClick={enterroom} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="joinasbutton" viewBox="0 0 16 16">
                <path  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.854 10.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"/>
                </svg>
            </div>
        )
    }

    return (
        <div>
            <div className='codeideheader'>
                <img src={Codesynclogo} onClick={backtolanding}></img>
                <h4 onClick={backtolobby}>Leave Room</h4>
            </div>
            <div className='colabide'>
                <CodeEditor></CodeEditor>
                <Chat></Chat>
            </div>
        </div>
    )
}
