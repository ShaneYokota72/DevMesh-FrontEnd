import React from 'react'

export default function Stats(props) {
  return (
    <div className='stats'>
      <p className='icon'>{props.icon}</p>
      <h2 className='statdesc'>{props.desc}</h2>
      <p className='statdesc2'>{props.desc2}</p>
    </div>
  )
}
