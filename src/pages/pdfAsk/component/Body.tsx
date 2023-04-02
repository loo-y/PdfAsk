import React from 'react'
import PdfReader from './PdfReader';
import ChatTalk from './ChatTalk'

const Body = ()=>{
    return (
        <div className='pdfask_body'>
            <PdfReader />
            <ChatTalk />
        </div>
    )
}

export default Body