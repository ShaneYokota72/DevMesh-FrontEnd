import React from 'react'
import Indfaq from './Indfaq'

export default function FAQ() {
    const faqs = [
        {question: "Do I have to make an account to use CodeSync+?", answer: "No! There's no need to make an account to use CodeSync+."},
        {question: "Are there user limit for rooms?", answer: "No! As many people can join the room. If you want to restrict the number of people in the room, you can make the room private and only share the roomid with the people you want to join."},
        {question: "Will the coding progress be saved?", answer: "We offer to store the progress for one day. After one day, the progress and the room will be deleted."}]
  return (
    <div style={{paddingBottom: "5vw"}} id='faq'>
      <h2 className='faqtitle'>Frequently Asked Question</h2>
      <div className='allfaq'>
        {faqs.map((faq) => (<Indfaq question={faq.question} answer={faq.answer}></Indfaq>))}
      </div>
    </div>
  )
}
