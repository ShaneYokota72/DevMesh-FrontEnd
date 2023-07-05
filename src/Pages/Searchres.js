import React, {useState} from 'react'
import codelogo from '../Images/code.svg'
import { useHover } from "@uidotdev/usehooks";

export default function Searchres() {
    const [ref, hovering] = useHover();
    const [redirect, setredirect] = useState(false);

    function handleclick(){
        setredirect(true);
    }
    if(redirect){
        // setroomcreater(props.username);
        // return <Navigate to={`/room/${props.roomid}`}></Navigate>
    }
    return (
        <div className='searchres' onClick={handleclick} ref={ref}>
            {hovering? 
                (
                    <div className='hoverjoin'>
                        <p>Click to join the room</p>
                    </div>
                ) 
                : 
                (
                    null
                )}
            <div className='searchresf_row'>
                <img src={codelogo} alt='codelogo'></img>    
                <span>July 7th</span>
            </div> 
            <h3>Shane Yokota</h3>
            <div className='tags'>
                <span>Python</span>
                <span>Java</span>
                <span>C#</span>
            </div>
            <p>
            Description about the room. What kind of help you need, what kind of people you want to solve this problem with.
            </p>
        </div>
    )
}
