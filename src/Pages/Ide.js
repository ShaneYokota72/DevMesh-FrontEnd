import React, {useContext, useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom'
import devlogo from '../Images/DevLogo.png'
import Toggle from 'react-toggle'
import {UserContext} from '../App';
import { Navigate } from 'react-router-dom'
import { io } from 'socket.io-client';
import Notification from './Notification.js';

import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { loadLanguage, langNames } from '@uiw/codemirror-extensions-langs';

import send from '../Images/send.svg'
import Indmsg from './Indmsg';

const code = [
    ["cpp", 'cout << "Hello World!" << endl;'],
    ["python", 'print("Hello World!")'],
    ['java', 'System.out.println("Hello World!");'],
    ['javascript', 'console.log("Hello World!");'],
    ['c', 'printf("Hello World!");'],
    ['csharp', 'Console.WriteLine("Hello World!");'],
    ['go', 'fmt.Println("Hello World!")'],
    ['ruby', 'puts "Hello World!"'],
    ['rust', 'println!("Hello World!");'],
    ['typescript', 'console.log("Hello World!");'],
    ['kotlin', 'println("Hello World!")'],
    ['swift', 'print("Hello World!")'],
    ['php', 'echo "Hello World!";'],
    ['dart', 'print("Hello World!");'],
    ['scala', 'println("Hello World!")'],
    ['perl', 'print "Hello World!\\n";'],
    ['haskell', 'main = putStrLn "Hello World!"'],
    ['r', 'print("Hello World!")'],
    ['elixir', 'IO.puts "Hello World!"'],
    ['cpp', 'cout << "Hello World!" << endl;'],
]
const codemap = new Map(code);

export default function Ide() {
    const {id} = useParams();
    const [redirect, setredirect] = useState(false);
    const [redirect_tologin, setredirect_tologin] = useState(false);
    const {theme, setTheme, userinformation} = useContext(UserContext);
    const [backtolobby, setbacktolobby] = useState(false);
    const [msg, setmsg] = useState('');
    const buttonRef = useRef(null);
    const socketRef = useRef(null);
    const [roomchat, setroomchat] = useState([]);
    const [userjoin, setuserjoin] = useState([]);
    const [iscreater, setiscreater] = useState(false);

    const [content, setContent] = useState('');
    const [langname, setLangname] = useState('cpp');
    
    function userjoinfunc(name) {
        setuserjoin((userjoin) => [...userjoin, name]);
    } 

    useEffect(()=>{
        const socket = io(process.env.REACT_APP_SOCKETPORT);
        socketRef.current = socket;

        socket.emit("join-room", id, userinformation.displayname);

        // receive change for IDE
        socket.on("receive-changes", delta => {
            setContent(delta);
        })
        // connection notification
        socket.on('user-connected', (name)=>{
            // console.log(name, 'connected');
            userjoinfunc(name);
        })
        // disconnection notification
        socket.on('user-disconnected', (name)=>{
            console.log(name, 'disconnected');
        })
        // receive chat msg
        socket.on('receive-message', (msg) => {
            setroomchat(chat => [...chat, msg])
        });

        return () => {
            socket.disconnect();
        }
    }, [id, userinformation.displayname])

    const onChange = React.useCallback((value, viewUpdate) => {
        setContent(value);
        socketRef.current.emit("send-changes", value, id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function retrieve(rid){
        const response = await fetch(`${process.env.REACT_APP_APIPORT}/room/`+rid);
        if(response.status === 404 || response.status === 500 || !response.ok){
            alert("Room not found");
            setbacktolobby(true);
        }
        if(response.ok){
            response.json().then(data => {
                if(data.content === ''){
                    setContent(codemap.get(langname));
                } else {
                    setContent(data.content);
                }

                if(data.creater === userinformation._id){
                    setiscreater(true);
                }
            })
        }
    }

    useEffect(()=>{
        retrieve(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [langname, id])

    useEffect(()=>{
        if(!userinformation.username){
            setredirect_tologin(true);
        }
    }, [userinformation])

    function handlethemechange(){
        if(theme === 'light'){
            setTheme('dark');
        }
        else{
            setTheme('light');
        }
    }

    async function delroom(){
        const response = await fetch(`${process.env.REACT_APP_APIPORT}/delroom/`+id, {
            method: 'DELETE',
            headers: {'Content-type':'application/json'},
        })
        if(response.ok){
            setbacktolobby(true);
        }
    }

    function handleRedirect(){
        setredirect(true);
    }
    function redirecttolobby(){
        setbacktolobby(true);
    }

    async function sendmsg(){
        if(msg === ''){
            return;
        }
        const text = {
            name: userinformation.displayname,
            msg: msg,
        }
        socketRef.current.emit('send-message', text, id);
        setroomchat([...roomchat, text]);
        setmsg('');
    }

    const handleKeyPress = (e) => {
        if (e.code === "Enter") {
            sendmsg();
        }
    };

    async function save(rid, cnt){
        const responce = await fetch(`${process.env.REACT_APP_APIPORT}/save/`+rid, {
            method: 'PUT',
            body: JSON.stringify({roomid: rid, content:cnt}),
            headers: {'Content-type':'application/json'},
        })
        return responce.status;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            save(id, content)
            .then((savesucc) => {
                if(savesucc===404){
                    alert("Error saving file - The room may not exist");
                    setbacktolobby(true);
                }
            })
        }, 5000);
        return () => clearInterval(interval);
    }, [content, id]);

    if(redirect){
        return <Navigate to='/'></Navigate>;
    }
    if(redirect_tologin){
        return <Navigate to='/login'></Navigate>
    }
    if(backtolobby){
        return <Navigate to='/lobby'></Navigate>
    }

    return (
        <>
            <div className='notifsection'>
                {
                    userjoin.length > 0 ? (
                        userjoin.map((name, index) => (<Notification name={name} key={index}></Notification>))
                    ):(null)
                }
            </div>
            <nav className='navbar' id='idenav'>
                <img src={devlogo} alt='DevMesh Logo' onClick={handleRedirect}></img>
                <div className='lobbyacc'>
                    <h5 className='welcomemsg'>{`Welcome ${userinformation.displayname}`}</h5>
                    <Toggle
                        onChange={handlethemechange}
                        icons={{ checked: "🌙", unchecked: "🔆" }}
                        aria-label="Dark mode toggle" />
                    {iscreater && <h5 className='redirectlink' style={{fontSize:'20px'}} onClick={delroom}>Close</h5>}
                    <h5 className='redirectlink' style={{fontSize:'20px'}} onClick={redirecttolobby}>Leave</h5>
                </div>
            </nav>
            <div className='ide'>
                <div className='ideleft'>
                    <div className='ideinfo'>
                        <select name="programminglang" id="programminglang" value={langname} onChange={(e) => setLangname(e.target.value)}>
                            {langNames.map((langname) => (
                                <option key={langname} value={langname}>{langname}</option>
                            ))}
                        </select>
                        <div className='roomidcopy'>
                            <h5 className='roomidtext' style={{fontSize: "16px"}}>Room:</h5>
                            <p className='roomidtext' style={{fontSize: "14px"}}>{id}</p>
                        </div>
                    </div>
                    <div id='codeide'>
                        <CodeMirror
                            value= {content}
                            height="85vh"
                            width='65vw'
                            theme={vscodeDark}
                            extensions={[loadLanguage(langname)]}
                            onChange={onChange}
                            id='codeide'
                        />
                    </div>
                </div>
                <div className='ideright'>
                    <div className='chat'>
                        <div className='message'>
                            {roomchat.map( (content, index) => (<Indmsg key={index} msg={content.msg} name={content.name}></Indmsg>))}
                        </div>
                        <div className='messageinput'>
                            <input type='text' placeholder='Type a message' onKeyDown={handleKeyPress} value={msg} onChange={e => setmsg(e.target.value)} className='messagebar'></input>
                            <img src={send} alt='send' ref={buttonRef} className='sendbutton' onClick={sendmsg}></img>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
