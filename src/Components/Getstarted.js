import React from 'react'
import Comment from './Comment'
import review1 from './review1.webp'
import review2 from './review2.webp'
import review3 from './review3.webp'

import { useNavigate } from 'react-router-dom'



export default function Getstarted() {
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `lobby`; 
        navigate(path);
    }

    return (
    <div className='getstarted'>
        <h2>Collaborate. Code. Thrive. 
        <br></br>Join the CodeSnap+ revolution now!</h2>
        <div>
            <button className='getstartedbutton' onClick={routeChange}>Get Started</button>
            <button className='learnmorebutton'>Learn More</button>
        </div>
        <div className='commentsection'>
            <Comment img={review1} comment="The real-time collaboration is a game-changer for our team." user="Tommy Martinez"></Comment>
            <Comment img={review2} comment="CodeSync+ changed my life! I can't imagine coding without it anymore." user="Sarah Johnson"></Comment>
            <Comment img={review3} comment="Getting help on my code is so much more easy with CodeSync+" user="Olivia Carter"></Comment>
        </div>
    </div>
  )
}
