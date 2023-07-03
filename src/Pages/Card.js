import React from 'react'

export default function Card(props) {
    console.log(props)
  return (
    <div className='card'>
        <img src={props.img}></img>
        <h3>{props.title}</h3>
        <p>{props.desc}</p>
    </div>
  )
}
