import React from 'react'

export default function Comment(props) {
    return (
    <div className='comments'>
        <img src={props.img}></img>
        <h3>{props.comment}</h3>
        <p>{props.user}</p>
    </div>
  )
}
