import React, { useContext } from 'react'
import { UserContext } from '../App';

export default function Individualtext(props) {
    const {sender, text} = props;
    const userinfo = useContext(UserContext);
    const username = userinfo.username;
    return (
        <>
            {username === sender ? (
                <div className='indtext' id='mytext'>
                <p>me</p>
                <h5>{text}</h5>
                </div>
            ) : (
                <div className='indtext' id='otherstext'>
                <p>{sender}</p>
                <h5>{text}</h5>
                </div>
            )}
        </>
    )
}
