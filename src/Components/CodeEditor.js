import React, { useEffect, useRef , useState} from 'react'
import '../App.css'
import { io } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { loadLanguage, langNames, langs } from '@uiw/codemirror-extensions-langs';
import { Navigate, useParams } from 'react-router-dom';
import { UserContext } from '../App';

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

export default function CodeEditor() {
    const {roomid} = useParams();
    const {setroomcreater} = React.useContext(UserContext);
    const [content, setContent] = useState('');
    const [langname, setLangname] = useState('cpp');
    const [backtolobby, setbacktolobby] = useState(false);
    const [idforcopy, setidforcopy] = useState('');

    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_SOCKETPORT);
        socketRef.current = socket;
        // console.log('Codeeditor: joining room', roomid);
        socket.emit("join-room", roomid);
    
        socket.on("receive-changes", (delta) => {
          setContent(delta);
        });
    
        return () => {
          socket.disconnect(); // Disconnect the socket when the component is unmounted
        };
      }, [roomid]);

    async function save(rid, cnt){
        // console.log("in save", rid, cnt);
        const responce = await fetch(`${process.env.REACT_APP_APIPORT}/save/`+roomid, {
            method: 'PUT',
            body: JSON.stringify({roomid: rid, content:cnt}),
            headers: {'Content-type':'application/json'},
        })
        return responce.status;
    }

    async function retrieve(rid){
        const response = await fetch(`${process.env.REACT_APP_APIPORT}/room/`+rid);
        if(response.status === 404 || response.status === 500 || !response.ok){
            alert("Room not found");
            setbacktolobby(true);
        }
        if(response.ok){
            response.json().then(data => {
                // console.log(data);
                if(data === ''){
                    setContent(codemap.get(langname));
                } else {
                    setContent(data);
                }
            })
        }
    }

    useEffect(()=>{
        retrieve(roomid);
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            save(roomid, content)
            .then((savesucc) => {
                if(savesucc===404){
                    alert("Error saving file - The room has been deleted");
                    setroomcreater('');
                    setbacktolobby(true);
                }
            })
        }, 3000);
        return () => clearInterval(interval);
    }, [content]);

    function copyroomid(){
        navigator.clipboard.writeText(roomid);
        setidforcopy("rotate")
        setTimeout(function() {
            setidforcopy("");
        }, 1000); 
    }

    const onChange = React.useCallback((value, viewUpdate) => {
        // console.log('value:', value);
        setContent(value);
        socketRef.current.emit("send-changes", value, roomid);
    }, []);

    if(backtolobby){
        return <Navigate to="/lobby"></Navigate>
    }

    return (
        <div className='codeeditor'>
            <div className='plang'>
                <select name="programminglang" id="programminglang" value={langname} onChange={(e) => setLangname(e.target.value)}>
                    {langNames.map((langname) => (
                        <option key={langname} value={langname}>{langname}</option>
                    ))}
                </select>
                <div className='proglangnext'>
                    <div className='copyroomid'>
                        <span>ROOM ID : {roomid}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={copyroomid} width="16" height="16" fill="white" id={idforcopy} className="copyroomidbutton" viewBox="0 0 16 16">
                        <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"/>
                        <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"/>
                        <path d="M8.5 6.5a.5.5 0 0 0-1 0V8H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V9H10a.5.5 0 0 0 0-1H8.5V6.5Z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <CodeMirror
            value= {content}
            height="85vh"
            width='60vw'
            theme={vscodeDark}
            extensions={[loadLanguage(langname)]}
            onChange={onChange}
            />
        </div>
    );
}
