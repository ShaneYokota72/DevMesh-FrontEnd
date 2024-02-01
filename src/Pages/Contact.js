import React from 'react'
import githublogo from '../Images/github.svg'

export default function Contact() {
  return (
    <div className='contact'>
      <h2>Contact</h2>
      <div className='contactinline'>
        <h5>Feedback? Suggestions? Features you'd like to see?</h5><a href='https://www.linkedin.com/in/shaneyok/'>Contact Me</a>
      </div>
      <div className='contactinline'>
        <h5>Made by</h5><a href='mailto:shaneyok@usc.edu'>Shane Yokota</a>
      </div>
      <h5>Copyright © 2024 All Rights Reserved</h5>
      <a href='https://github.com/ShaneYokota72/DevMesh-FrontEnd'>
        <img src={githublogo} alt='github logl' className='githublogo'></img>
      </a>
    </div>
  )
}
