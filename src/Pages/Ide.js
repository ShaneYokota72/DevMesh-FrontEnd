import React, {useContext, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import devlogo from '../Images/DevLogo.png'
import Toggle from 'react-toggle'
import {UserContext} from '../App';
import { Navigate } from 'react-router-dom'

import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { loadLanguage, langNames } from '@uiw/codemirror-extensions-langs';

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

    const [content, setContent] = useState('');
    const [langname, setLangname] = useState('cpp');

    const onChange = React.useCallback((value, viewUpdate) => {
        // console.log('value:', value);
        setContent(value);
        // socketRef.current.emit("send-changes", value, roomid);
    }, []);

    async function retrieve(rid){
        const response = await fetch(`${process.env.REACT_APP_APIPORT}/room/`+rid);
        if(response.status === 404 || response.status === 500 || !response.ok){
            alert("Room not found");
            setbacktolobby(true);
        }
        if(response.ok){
            response.json().then(data => {
                if(data === ''){
                    setContent(codemap.get(langname));
                } else {
                    setContent(data);
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

    function handleRedirect(){
        setredirect(true);
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
            <nav className='navbar' id='idenav'>
                <img src={devlogo} alt='DevMesh Logo' onClick={handleRedirect}></img>
                <div className='account'>
                    <Toggle
                        onChange={handlethemechange}
                        icons={{ checked: "🌙", unchecked: "🔆" }}
                        aria-label="Dark mode toggle" />
                    <h5 className='redirectlink' style={{fontSize:'20px'}}>Close</h5>
                    <h5 className='redirectlink' style={{fontSize:'20px'}}>Leave</h5>
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

                    </div>
                </div>
            </div>
        </>
    )
}
