import React, { useEffect, useState, useCallback } from 'react';
import { useCtrl, useModelState } from 'react-imvc/hook'
import Ctrl from '../Controller'
import { State } from '../Model'
import { Form, FloatingLabel, Button, Card} from 'react-bootstrap'
import _ from 'lodash'
import { AnyObj } from '../types';

const ChatTalk = () => {
    const state: AnyObj = useModelState<State>() || {}
    const {} = state || {}
    return (
        <div id="chat_talk">
            <AskIput />
            <AnswerBlock />
        </div>
    )
}

export default ChatTalk


  
const AskIput = ()=>{
    const { handleGetAnswer  } = useCtrl<Ctrl>()
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const inputId = `floatingInput`
    const formSubmit = (e)=>{
        e.stopPropagation();
        e.preventDefault()
        const input = e?.target?.elements?.[inputId];
        const inputValue = input?.value || ``
        handleGetAnswer(inputValue)
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

const bottomLine = `bottomLine`
const AnswerBlock = ()=>{
    const state: AnyObj = useModelState<State>() || {}
    const {
        rollAskAnswerInfo,
    } = state

    const [answerCount, setAnserCount] = useState(rollAskAnswerInfo?.length || 0)

    useEffect(()=>{
        if(rollAskAnswerInfo?.length > answerCount){
            const element = document.querySelector(`#${bottomLine}`);
            element.scrollIntoView({ behavior: 'smooth' });
            setAnserCount(rollAskAnswerInfo.length)
        }
    }, [rollAskAnswerInfo])

    return (
        <div className='answer_block'>
            {_.map(rollAskAnswerInfo, (answertem)=>{
                const {
                    timestamp,
                    answer,
                } = answertem || {}
                if(answer){
                    return (
                        <div key={`talkinfo_${timestamp}`}>
                            <TypingCard talkItem={answertem} />
                        </div>
                    )
                }else{
                    return null
                }
                
            })}
            <div id={bottomLine} />
        </div>
    )
}

const TypingCard = ({talkItem, noTyping}: {talkItem: any, noTyping?: boolean})=>{
    const {
        answer,
        question,
        timeShort,
        timestamp,
    } = talkItem || {}

    const textLength = answer?.length || 0
    const [count, setCount] = useState(noTyping ? textLength : 0)
    const [typingText, setTypeText] = useState(answer?.[0] || '')
    useEffect(()=>{
        if(count <= textLength){
            setTypeText(answer?.substr(0, count) || '')
            setTimeout(()=>{
                setCount(count + 1)
            }, 100)
        }
    }, [count])
    return (
        <Card style={{ width: '100%', marginBottom: "12px" }} bg={`dark`} text="light">
            <Card.Body>
                <Card.Subtitle>{``}</Card.Subtitle>
                <Card.Text>
                    {typingText}
                </Card.Text>

            </Card.Body>
            <Card.Footer>
                <small className="text-secondary">{timeShort}</small>
            </Card.Footer>
        </Card>
    )
}