import React, {useState, useEffect, useContext} from 'react'
import { Link , Navigate} from 'react-router-dom';
import SearchResult from './SearchResult';
import { UserContext } from '../App';

export default function Lobby() {
    const [shownewroomform, setshownewroomform] = useState(false);
    const [showjoinroomform, setshowjoinroomform] = useState(false);

    const [ispublic, setispublic] = useState(false);
    const [name, setname] = useState('');
    const [tag, settag] = useState('');
    const [desc, setdesc] = useState('');

    const [roomid, setroomid] = useState('');
    const [redirect, setredirect] = useState(false);
    const [keyword, setkeyword] = useState('');
    const [searchres, setsearchres] = useState([]);

    const [joinroomcode, setjoinroomcode] = useState('');
    const [redirectjoinroom, setredirectjoinroom] = useState(false);

    const [moreroomopen, setmoreroomopen] = useState(true);
    const [shake, setshake] = useState('');

    const userinfo = useContext(UserContext);

    async function fetchdata(datalimit=6){
        const beforelength = searchres.length;
        const responce = await fetch(`${process.env.REACT_APP_APIPORT}/roomopen/${datalimit}`, {
            method: 'GET',
            headers: {'Content-type':'application/json'},
        })
        if(responce.ok){
            responce.json().then(data => {
                setsearchres(data);
                if(data.length < datalimit){setmoreroomopen(false)}
                if(beforelength === data.length){
                    alert('No more rooms to load');
                }
            })
        }
    }

    useEffect(() => {
        fetchdata();
    },[])

    useEffect(()=>{
        if(keyword === ''){
            fetchdata();
        }
    }, [keyword])

    function handleNRform(){
        setshownewroomform(true)
        setshowjoinroomform(false)
    }
    function handleJRform(){
        setshowjoinroomform(true)
        setshownewroomform(false)
    }
    function statereset(){
        setshownewroomform(false)
        setshowjoinroomform(false)
    }

    async function loadmore(){
        if(moreroomopen === false){
            // shake the loadmore button
            setshake('shake');
            setTimeout(() => {
                setshake('');
            }, 1000);
            return;
        }
        fetchdata(searchres.length+6)
    }
    
    async function refreshsearchres(){
        console.log('refreshing', keyword);
        const responce = await fetch(`${process.env.REACT_APP_APIPORT}/search`, {
            method: 'POST',
            body: JSON.stringify({keyword: keyword}),
            headers: {'Content-type':'application/json'},
        });
        if(responce.ok){
            responce.json().then(data => {
                // console.log(data);
                setsearchres(data);
            })
        }
    }   

    async function createnewroom(e){
        if(ispublic === null || name === '' || tag === '' || desc === ''){
            alert('Please fill out all information');
            return;
        }
        e.preventDefault();
        const responce = await fetch(`${process.env.REACT_APP_APIPORT}/room`, {
            method: 'POST',
            body: JSON.stringify({ispublic, name, tag, desc}),
            headers: {'Content-type':'application/json'},
        })
        if(responce.ok){
            responce.json().then(data => {
                setroomid(data.roomid);
                userinfo.setusername(name);
                userinfo.setroomcreater(name);
                setredirect(true);
            })
        }
    }

    function redirecttoroom(){
        setredirectjoinroom(true);
    }

    if(redirectjoinroom){
        return <Navigate to={'/room/'+joinroomcode}></Navigate>
    }

    if(redirect){
        return <Navigate to={'/room/'+roomid}></Navigate>
    }

    return (
        <div className='lobby'>
            <div className='lobbybutton'>
                <button onClick={handleNRform}>New Room</button>
                <button onClick={handleJRform}>Join Room</button>
            </div>
            {shownewroomform && (
                <div className='newroomform'>
                    <Link to="/lobby" className='popupgone' onClick={statereset}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="popupX" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    </Link>
                    <h2>Create New Room</h2>
                    <form onSubmit={createnewroom}>
                        <div>
                            <h3>Room Type: </h3>
                            <input type="radio" value={ispublic} name='roomtype' onClick={()=>setispublic(true)}/> <span>Public </span>
                            <input type="radio" value={ispublic} name='roomtype' onClick={()=>setispublic(false)}/> <span>Private </span>
                        </div>
                        <span>Your name:</span> <input type='text' className='forminputsection' value={name} onChange={ev=>setname(ev.target.value)}/>
                        <span>Tag:</span> <input type='text' placeholder='cpp, java, beginner' className='forminputsection' value={tag} onChange={ev=>settag(ev.target.value)}/>
                        <span>Description about the room:</span> <input type='text' placeholder='I need help with my personal project.' className='forminputsectiondesc' value={desc} onChange={ev=>setdesc(ev.target.value)}/>
                        <button type='submit' className='createbutton'>Create</button>
                    </form>
                </div>
            )}
            {showjoinroomform && (
                <>
                    <div className='newroomform'>

                        <Link to="/lobby" className='popupgone' onClick={statereset}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="popupX" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        </Link>
                        <h2>Join Room</h2>
                        <div className='joinroomform'>
                            <h3>codesync.vercel.app/</h3>
                            <input className='joinroominputsec' type='text' placeholder='Enter Room Code' value={joinroomcode} onChange={ev => setjoinroomcode(ev.target.value)}></input>
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={redirecttoroom} width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </div>
                    </div>
                </>
                
            )}
            <div className='openrooms'>
                <h1 className='openroomtitle'>Open Rooms</h1>
                <div className='search'>
                    <input type='text' placeholder='room description' className='searchbar' value={keyword} onChange={ev=>setkeyword(ev.target.value)}/>
                    <svg className='searchbutton' onClick={refreshsearchres} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </div>
                <div className='searchresult'>
                    {searchres?.map((res, index) => <SearchResult key={index} roomid={res._id} username={res.creater} tags={res.tag} desc={res.desc}></SearchResult>)}
                    
                    <svg xmlns="http://www.w3.org/2000/svg" id={shake} onClick={loadmore} width="26" height="26" fill="currentColor" className="loadmorebutton" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                    </svg>
                   
                   
                </div>
            </div>
        </div>
    )
}
