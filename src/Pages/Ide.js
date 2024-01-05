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
import copy from '../Images/copy.svg'
import github from '../Images/github.svg'

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
    const [idforcopy ,setidforcopy] = useState('');
    const [showpopup, setshowpopup] = useState(false);

    const [content, setContent] = useState({});
    const [currfile, setCurrfile] = useState('filename');
    const [langname, setLangname] = useState('cpp');
    const [newfilecreate, setNewfilecreate] = useState(false);

    useEffect(() => {
        console.log("content", content)
        console.log("currfile", currfile)
        console.log(Object.keys(content))
    },[content])
    
    function userjoinfunc(name) {
        setuserjoin((userjoin) => [...userjoin, name]);
    } 

    const messageRef = useRef(null);

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [roomchat]);

    useEffect(()=>{
        const socket = io(process.env.REACT_APP_SOCKETPORT);
        socketRef.current = socket;

        socket.emit("join-room", id, userinformation.displayname);

        // receive change for IDE
        socket.on("receive-changes", (delta, filename) => {
            setContent(prevContent => ({ 
                ...prevContent, 
                [filename] : delta 
            }));
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
        setContent(prevContent => ({ ...prevContent, filename : value }));
        socketRef.current.emit("send-changes", value, id, currfile);
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
                if(data.content === null || data.content === undefined){
                    const filename = `devmesh.${langname}`
                    setContent(prevContent => ({ 
                        ...prevContent, 
                        [filename] : codemap.get(langname) 
                    }));
                    setCurrfile(filename)
                } else {
                    setContent(data.content);
                    setCurrfile(Object.keys(content)[0])
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
            body: JSON.stringify({roomid: rid, content:cnt}), // change
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

    function copyroomid(){
        navigator.clipboard.writeText(id);
        setidforcopy("rotate");
        setTimeout(function() {
            setidforcopy("");
        }, 1000); 
    }

    async function handleclone(){
        const url = document.querySelector('.popupinput').value;
        if(url === ''){
            alert('Please enter a valid URL');
            return;
        }
        const responce = await fetch(`${process.env.REACT_APP_APIPORT}/gitclone`, {
            method: 'POST',
            body: JSON.stringify({roomid: id, repoPath: url}),
            headers: {'Content-type':'application/json'},
        })
        if(responce.ok){
            setshowpopup(false);
            retrieve(id);
        }
        return responce.status;
    }

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
                        {/* <select name="programminglang" id="programminglang" value={langname} onChange={(e) => setLangname(e.target.value)}>
                            {langNames.map((langname) => (
                                <option key={langname} value={langname}>{langname}</option>
                            ))}
                        </select> */}
                        <div className='tabscollection'>
                            {
                                Object.keys(content).map((file, index) => (
                                    <h4 className='tabs' key={index}>{file}</h4>
                                ))
                            }
                            {
                                newfilecreate && 
                                <div>test</div>
                            }
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg copylogo" style={{marginLeft: "10px"}} viewBox="0 0 16 16" onClick={() => setNewfilecreate(!newfilecreate)}>
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                        </div>
                        {/* add a plus icon to add a file */}
                        <div className='idenavbarright'>
                            <img src={github} alt='github logo' className='copylogo' onClick={() => setshowpopup(!showpopup)}></img>
                            <div className='roomidcopy'>
                                <h5 className='roomidtext' style={{fontSize: "16px"}}>Room:</h5>
                                <p className='roomidtext' style={{fontSize: "14px"}}>{id}</p>
                                <img src={copy} alt='copy logo' className='copylogo' onClick={copyroomid} id={idforcopy}></img>
                            </div>
                        </div>
                    </div>
                    <div id='codeide'>
                        <CodeMirror
                            value= {content[currfile]}
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
                            <div ref={messageRef} />
                        </div>
                        <div className='messageinput'>
                            <input type='text' placeholder='Type a message' onKeyDown={handleKeyPress} value={msg} onChange={e => setmsg(e.target.value)} className='messagebar'
                            style={{width: "100%"}}></input>
                            <img src={send} alt='send' ref={buttonRef} className='sendbutton' onClick={sendmsg}></img>
                        </div>
                    </div>
                </div>
            </div>
            {
                showpopup && (
                    <div className='popup'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="popupX" style={{top:'1vw', right:'1vw'}} onClick={() => setshowpopup(!showpopup)} viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        <div className='popupinner'>
                            <h5 className='popupheader'>Github Repo to Clone</h5>
                            <div className='popupgithubinfo'>
                                <span className='popupspan'>Repo URL:</span>
                                <input className='popupinput'></input>
                                <button className='popupbutton' onClick={handleclone}>Clone</button>
                            </div>
                        </div>
                    </div>
                )       
            }
        </>
    )
}
