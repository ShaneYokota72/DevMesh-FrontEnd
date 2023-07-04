import React, {useState, useContext, useEffect} from 'react'
import {UserContext} from '../App';

export default function Card(props) {
    const {theme} = useContext(UserContext);
    const [imgid, setimgid] = useState('');

    useEffect(() => {
        if(theme === 'light'){
            setimgid('');
        } else {
            setimgid('invertimg');
        }
    }, [theme])
    return (
        <div className='card'>
            <img src={props.img} alt='feature logo' id={imgid}></img>
            <h3>{props.title}</h3>
            <p>{props.desc}</p>
        </div>
    )
}
