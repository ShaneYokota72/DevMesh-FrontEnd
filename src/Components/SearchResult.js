import React, {useEffect, useState} from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../App';
import { useHover } from "@uidotdev/usehooks";

export default function SearchResult(props) {
    const {setroomcreater} = React.useContext(UserContext);
    const [redirect, setredirect] = useState(false);
    const [ref, hovering] = useHover();
    

    function handleclick(){
        setredirect(true);
    }

    if(redirect){
        setroomcreater(props.username);
        return <Navigate to={`/room/${props.roomid}`}></Navigate>
    }

    return (
        <div className='result' onClick={handleclick} ref={ref}>
            {hovering? 
            (
                <div className='hoverjoin'>
                    <p>Click to join</p>
                </div>
            ) 
            : 
            (
                null
            )}
            <h1>{props.username}</h1>
            <div className='tags'>
                {props.tags.split(',')?.map(tag => <span key={tag}>{tag}</span>)}
            </div>
            <p className='propsdesc'>{props.desc}</p>
        </div>
    )
}
