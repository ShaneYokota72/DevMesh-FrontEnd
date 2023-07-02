import React from 'react'
import "../App.css"
import Stats from './Stats'

export default function Explanation() {
  return (
    <div className='explanation' id='aboutcodesync+'>
      <h1>Revolutionize Your Coding Workflow</h1>
      <p className='aboutus'>
        Collaborate, Code, Excel. 
        <br></br>
        <br></br>
        Experience the power of seamless collaborative code editing for all your coding needs. 
        <br></br>
        Get help, share knowledge, and have fun coding with others. Join our vibrant community of developers and unlock new possibilities today.
        <br></br>
        <br></br>
        Dive into real-time collaboration with fellow developers. No more sending code snippets back and forth on messaging apps - we're leaving those dark ages behind!
      </p>
      <div className='test'>
        <Stats icon='⚡️' desc='1000+' desc2='Code Snippets Helped'></Stats>
        <Stats icon='👥' desc='500+' desc2='Team Projects'></Stats>
        <Stats icon='💾' desc='10ms' desc2='Latency'></Stats>
      </div>
    </div>
  )
}
