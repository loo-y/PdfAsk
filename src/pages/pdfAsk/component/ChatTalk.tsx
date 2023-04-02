import React, { useEffect, useState, useCallback } from 'react';
import { useCtrl, useModelState } from 'react-imvc/hook'
import Ctrl from '../Controller'
import { Form, FloatingLabel, Button} from 'react-bootstrap'
import _ from 'lodash'

const ChatTalk = () => {
    return (
        <div id="chat_talk">
            <AskIput />
        </div>
    )
}

export default ChatTalk


  
const AskIput = ()=>{
    // const { handlerSendWord  } = useCtrl<Ctrl>()
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const inputId = `floatingInput`
    const formSubmit = (e)=>{
        e.stopPropagation();
        e.preventDefault()
        const input = e?.target?.elements?.[inputId];
        const inputValue = input?.value || ``
        // handlerSendWord(inputValue)
        // clear input value
        input.value = ``
        setButtonDisabled(true)
        return false;
    }

    const onTextChange = (e)=>{
        const inputText = e?.target?.value;
        if(_.trim(inputText)?.length){
            setButtonDisabled(false)
        }else{
            setButtonDisabled(true)
        }
    }
    return (
        <div className='askinput'>
            <Form onSubmit={formSubmit}>
                <FloatingLabel
                    controlId={inputId}
                    label="请提问本PDF相关内容"
                    className="mb-3"
                >
                    <Form.Control as="textarea" placeholder="请提问本PDF相关内容" onChange={onTextChange} rows={3} />
                    <Button variant="primary" disabled={buttonDisabled} type="submit" className='ask_button'>提问</Button>
                </FloatingLabel>
            </Form>
        </div>
    )
}