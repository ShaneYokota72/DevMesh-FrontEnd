import React, {useContext, useEffect, useState} from 'react'
import { UserContext } from '../App';

export default function Indmsg(props) {
    const {userinformation} = useContext(UserContext);
    const [idval, setidval] = useState('');
    const [idmsgcontent, setidmsgcontent] = useState('');

    useEffect(()=>{
        if(userinformation.displayname === props.name){
            setidval('mymsg');
            setidmsgcontent('mymsgcontent');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
                
        <div className='msgblock' id={idval}>
            <span>{props.name}</span>
            <p className='msgcontent' id={idmsgcontent}>
                {props.msg}
            </p>
        </div>
    )
}
