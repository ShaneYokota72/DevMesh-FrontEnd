import React from 'react'
import Indfaq from './Indfaq'

export default function Faq() {
    const faqs = [
        {question: "Do I have to make an account to use DevMesh?", answer: "Yes! It helps us to keep track of your progress and also keeps your data safe."},
        {question: "Are there user limit for rooms?", answer: "No! As many people can join the room. If you want to restrict the number of people in the room, you can make the room private and only share the roomid with the people you want to join."},
        {question: "Will the coding progress be saved?", answer: "We offer to store the progress for 48 hours. Two days after the last edit, the progress and the room will be deleted."}
    ]
    return (
        <div className='faq'>
            <h2>Frequently Asked Questions</h2>
            <div className='faqlist'>
                {faqs.map((faq) => (<Indfaq question={faq.question} answer={faq.answer}></Indfaq>))}
            </div>
        </div>
    )
}
