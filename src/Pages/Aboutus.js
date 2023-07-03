import React from 'react'
import Card from './Card'

import terminal from '../Images/Terminalimg.png'
import chat from '../Images/Chatimg.png'
import store from '../Images/Saveimg.png'
export default function Aboutus() {
  return (
    <div className='about'>
      <h2>About Us</h2>
      <p>
        Collaborate, Code, Excel.

        Experience the power of seamless collaborative code editing for all your coding needs.
      </p>
      <div className='aboutuscards'>
        <Card img={terminal} title='Collaborative Coding' desc='Collaborate seamlessly on code snippets with others in real time, fostering teamwork and collective problem-solving.'></Card>
        <Card img={chat} title='Realtime Chat' desc='Instantly communicate and exchange ideas within code collaboration rooms.'></Card>
        <Card img={store} title='Free Storage' desc='Store and access your code snippets securely and conveniently in our platform for 48 hours.'></Card>
      </div>
    </div>
  )
}
