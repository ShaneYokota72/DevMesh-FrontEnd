import React, {useContext, useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom'
import devlogo from '../Images/DevLogo.png'
import Toggle from 'react-toggle'
import {UserContext} from '../App';
import { Navigate } from 'react-router-dom'
import { io } from 'socket.io-client';
import Notification from './Notification.js';
import {useDownload} from '../hooks/useDownload.js';

import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { loadLanguage, langNames } from '@uiw/codemirror-extensions-langs';
import copy from '../Images/copy.svg'
import github from '../Images/github.svg'
import download from '../Images/download.svg'

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
    const [showpopup_addfile, setshowpopup_addfile] = useState(false);

    const [content, setContent] = useState({});
    const [currfile, setCurrfile] = useState('filename');
    const [langname, setLangname] = useState('cpp');

    const downloadAllContent = useDownload(content);

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
        // receive changes after clone
        socket.on("receive-clone", (delta) => {
            setContent(delta);
            setCurrfile(Object.keys(delta)[0]);
        })
        // connection notification
        socket.on('user-connected', (name)=>{
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

    function onChange(filename){
        return function(value, viewUpdate){
            setContent(prevContent => ({ ...prevContent, [filename] : value }));
            socketRef.current.emit("send-changes", value, id, filename);
        }
    }

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
                    const keys = Object.keys(data.content);
                    if(keys.length > 0){
                        setCurrfile(keys[0]);
                    }
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
        const data = await responce.json();
        if(responce.ok){
            setshowpopup(false);
            setContent(data.content);
            setCurrfile(Object.keys(data.content)[0]);
            socketRef.current.emit("just-cloned", data.content, id);
        }
        return responce.status;
    }

    function switchtab(file){
        return function(){
            setCurrfile(file);
        }
    }

    function addfile(){
        const filename = document.querySelector('.popupinput').value;
        if(filename === ''){
            alert('Please enter a valid filename');
            return;
        }
        // if file already exist, alert and do not add
        if(Object.keys(content).includes(filename)){
            alert('File already exist');
            return;
        }
        setContent(prevContent => ({ 
            ...prevContent, 
            [filename] : codemap.get(langname) 
        }));
        setCurrfile(filename);
        setshowpopup_addfile(false);
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
                        <div className='tabscollection'>
                            {
                                Object.keys(content).map((file, index) => (
                                    <p onClick={switchtab(file)} className='tabs' style={{ borderBottomLeftRadius: (currfile === file) ? '0' : '10px', borderBottomRightRadius: (currfile === file) ? '0' : '10px' }} key={index}>{file}</p>
                                ))
                            }
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg copylogo" style={{marginLeft: "10px"}} viewBox="0 0 16 16" onClick={() => setshowpopup_addfile(!showpopup_addfile)}>
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                </svg>
                            </div>
                        </div>
                        <div className='idenavbarright'>
                            <img src={download} alt='download logo' className='copylogo' onClick={downloadAllContent}></img>
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
                            onChange={onChange(currfile)}
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
            {
                showpopup_addfile && (
                    <div className='popup'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="popupX" style={{top:'1vw', right:'1vw'}} onClick={() => setshowpopup_addfile(!showpopup_addfile)} viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        <div className='popupinner'>
                            <h5 className='popupheader'>New file name</h5>
                            <div className='popupgithubinfo'>
                                <input className='popupinput'></input>
                                <button className='popupbutton' onClick={addfile}>Add</button>
                            </div>
                        </div>
                    </div>
                )       
            }
        </>
    )
}
