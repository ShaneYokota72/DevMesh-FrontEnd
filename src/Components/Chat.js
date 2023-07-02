import React, {useEffect, useState, useRef} from 'react'
import '../App.css'
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Individualtext from './Individualtext.js';
import { UserContext } from '../App';

export default function Chat() {
    const {roomid} = useParams();
    const [text, settext] = useState('');
    const [convo, setconvo] = useState([]);
    const userinfo = React.useContext(UserContext);

    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_SOCKETPORT);
        socketRef.current = socket;
        // console.log('Chat: joining room', roomid+'chat');
        socket.emit("join-room", roomid+'chat');
        socket.on('receive-message', (msg) => {
            setconvo(prevConvo => [...prevConvo, msg]);
        })
    }, []);

    function sendmsg(){
        setconvo(prevConvo => [...prevConvo, {sender:userinfo.username, text:text}]);
        socketRef.current.emit("send-message", {text:text, sender:userinfo.username}, roomid+'chat');
        settext('');
    }

    return (
        <div className='chatsection'>
            <div className='convo'>
                {convo.map((msg, index) => (
                    <Individualtext sender={msg.sender} text={msg.text} key={index}></Individualtext>
                ))}
            </div>
            <div className='messagebar'>
                <input type='text' className='msginput' value={text} onChange={e => settext(e.target.value)}></input>
                <button onClick={sendmsg}>Send Message</button>
            </div>
        </div>
    )
}
