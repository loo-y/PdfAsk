import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useCtrl, useModelState } from 'react-imvc/hook'
import Ctrl from '../Controller'
import { State } from '../Model'
import { Form, FloatingLabel, Button, Card, Spinner } from 'react-bootstrap'
import Sticky from 'react-stickynode'
import { Scrollbars } from 'react-custom-scrollbars'
import _ from 'lodash'
import { AnyObj } from '../types'
import { PDF_UPLOAD_STATUS } from '../types'

const ChatTalk = () => {
    const state: AnyObj = useModelState<State>() || {}
    const { uploadStatus } = state || {}

    const stickyProps = {
        top: 20,
        enabled: true,
        className: `sticky_chat_talk`,
    }

    if (uploadStatus !== PDF_UPLOAD_STATUS.SUCCESS) {
        return <div id="chat_talk"></div>
    }
    return (
        <div id="chat_talk">
            <Sticky {...stickyProps}>
                <AskIput />
                <AnswerBlock />
            </Sticky>
        </div>
    )
}

export default ChatTalk

const AskIput = () => {
    const { handleGetAnswer } = useCtrl<Ctrl>()
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const inputId = `floatingInput`
    const formSubmit = async e => {
        setIsLoading(true)
        setButtonDisabled(true)
        e.stopPropagation()
        e.preventDefault()
        const input = e?.target?.elements?.[inputId]
        const inputValue = input?.value || ``
        await handleGetAnswer(inputValue)
        // clear input value
        input.value = ``
        setIsLoading(false)
        return false
    }

    const onTextChange = e => {
        const inputText = e?.target?.value
        if (_.trim(inputText)?.length) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }
    return (
        <div className="askinput">
            <Form onSubmit={formSubmit}>
                <FloatingLabel controlId={inputId} label="请提问本PDF相关内容" className="mb-3">
                    {isLoading ? (
                        <div className="loading_spinner">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : null}
                    <Form.Control
                        as="textarea"
                        className={isLoading ? 'loading' : ''}
                        readOnly={isLoading}
                        placeholder="请提问本PDF相关内容"
                        onChange={onTextChange}
                        rows={3}
                    />
                    <Button variant="primary" disabled={buttonDisabled} type="submit" className="ask_button">
                        {isLoading ? `Loading` : `提问`}
                    </Button>
                </FloatingLabel>
            </Form>
        </div>
    )
}

const bottomLine = `bottomLine`
let lazyToBottom: any
const AnswerBlock = () => {
    const state: AnyObj = useModelState<State>() || {}
    const { rollAskAnswerInfo } = state
    const scrollRef = useRef(null)
    const [scrollbarsMaxHeight, setScrollbarsMaxHeight] = useState(0)
    const [answerCount, setAnserCount] = useState(rollAskAnswerInfo?.length || 0)

    useEffect(() => {
        if (rollAskAnswerInfo?.length > answerCount) {
            const element = document.querySelector(`#${bottomLine}`)
            element.scrollIntoView({ behavior: 'smooth' })
            setAnserCount(rollAskAnswerInfo.length)
        }
    }, [rollAskAnswerInfo])

    useEffect(() => {
        let _scrollbarsMaxHeight = _.max([window?.innerHeight * 0.75 - 48, 0]) || 536
        setScrollbarsMaxHeight(_.min([_scrollbarsMaxHeight, 536]))
        const theBottom: HTMLElement = document.querySelector(`#${bottomLine}`)
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio === 1) {
                    console.log('Element is fully visible.')
                } else {
                    console.log('Element is not fully visible.')
                    scrollToBottom(theBottom)
                }
            })
        })
        observer.observe(theBottom)
    }, [])

    const renderScrollView = ({ style, ...props }) => {
        return <div {...props} style={{ ...style }} />
    }

    const scrollToBottom = (bottomLineEle: HTMLElement) => {
        // const theBottom: HTMLElement = document.querySelector(`#${bottomLine}`)
        lazyToBottom = setTimeout(() => {
            if (bottomLineEle) {
                const topNumber = bottomLineEle.offsetTop
                scrollRef.current.scrollTop(topNumber + 2)
            }
        }, 100)
    }

    const handleScrollFrame = () => {
        clearTimeout(lazyToBottom)
    }
    // if(!scrollbarsMaxHeight) return <div id={bottomLine} />

    return (
        <div className="answer_block">
            <Scrollbars
                autoHeight={true}
                autoHeightMax={scrollbarsMaxHeight}
                renderView={renderScrollView}
                onScrollFrame={handleScrollFrame}
                ref={scrollRef}
            >
                <div>
                    {_.map(rollAskAnswerInfo, answertem => {
                        const { timestamp, answer } = answertem || {}
                        if (answer) {
                            return (
                                <div key={`talkinfo_${timestamp}`}>
                                    <TypingCard talkItem={answertem} />
                                </div>
                            )
                        } else {
                            return null
                        }
                    })}
                </div>
                <div id={bottomLine} />
            </Scrollbars>
        </div>
    )
}

const TypingCard = ({ talkItem, noTyping }: { talkItem: any; noTyping?: boolean }) => {
    const { answer, question, timeShort, timestamp } = talkItem || {}

    const textLength = answer?.length || 0
    const [count, setCount] = useState(noTyping ? textLength : 0)
    const [typingText, setTypeText] = useState(answer?.[0] || '')
    useEffect(() => {
        if (count <= textLength) {
            setTypeText(answer?.substr(0, count) || '')
            setTimeout(() => {
                setCount(count + 1)
            }, 100)
        }
    }, [count])
    return (
        <Card style={{ width: '100%', marginBottom: '12px' }} bg={`dark`} text="light">
            <Card.Body>
                <Card.Subtitle>{``}</Card.Subtitle>
                <Card.Text>{typingText}</Card.Text>
            </Card.Body>
            <Card.Footer>
                <small className="text-secondary">{timeShort}</small>
            </Card.Footer>
        </Card>
    )
}
