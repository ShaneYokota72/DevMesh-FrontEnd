import React, {useState} from 'react'
import codelogo from '../Images/code.svg'
import { useHover } from "@uidotdev/usehooks";
import { format } from 'date-fns'
import { Navigate } from 'react-router-dom';

export default function Searchres(props) {
    const [ref, hovering] = useHover();
    const [redirect, setredirect] = useState(false);
    const tags = (props.tag)?.split(',');
    function handleclick(){
        setredirect(true);
    }
    if(redirect){
        return <Navigate to={`/room/${props.roomid}`}></Navigate>
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
                <span>{format(new Date(props.date), 'MMM do')}</span>
            </div> 
            <h3>{props.creatername}</h3>
            <div className='tags'>
                {tags?.map((tag, index) => (<span key={index}>{tag}</span>))}
            </div>
            <p>
            {props.desc}
            </p>
        </div>
    )
}
