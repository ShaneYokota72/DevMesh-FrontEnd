import React from 'react'
import Contact from './Contact'
import Features from './Features'

import demoshane from './Demo Shane Scr.png'
import Howitworkscard from './Howitworkscard'
import FAQ from './FAQ'

import demogif1 from './createjoincomp.gif'
import demogif2 from './chatdemocomp.gif'
import demogif3 from './colabeditcomp.gif'

export default function About() {

    return (
    <div>
      {/* about / company */}
        <div className='aboutustop'>
            <h1>Future of Collaborative Coding</h1>
            <img src={demoshane} alt='codesync demo screen'></img>
        </div>
        <div className='whatwedo' id='howitworks'>
            <h1 className='HIWtitle'>How It Works</h1>
            <div className='hiwgif'>
                <Howitworkscard gif={demogif1} svg='1' title='Create/Join Room' desc='Create a public room for anyone to join you or a private room for you and your friends. Join a room by simply pasting the roomid of your friend!'></Howitworkscard>
                <Howitworkscard gif={demogif2} svg='2' title='Chat With People In The Room' desc='No need to be on a call when collaborating! Type in the chat your needs and communicate!'></Howitworkscard>
                <Howitworkscard gif={demogif3} svg='3' title='Collaborative Coding' desc='The Code integrated development environment will be collaborative, allowing anyone to make changes at the same time. Work together and edit together!'></Howitworkscard>
            </div>
        </div>
        <Features></Features>
        <FAQ></FAQ>
        <Contact></Contact>
    </div>
  )
}
