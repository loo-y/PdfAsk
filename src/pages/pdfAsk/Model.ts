import _ from 'lodash'
import { Action, BaseState } from 'react-imvc'
import { AnyObj, AskAnswerInfo, ASK_ANSWER_STATUS } from './types'
import dayjs from 'dayjs'
type InitialState = { 
    pdfile?: any, 
    pagesContentList: AnyObj[],
    rollAskAnswerInfo: AskAnswerInfo[]
 }

export type State = BaseState & InitialState

export const initialState = {

}

export const ADD_QUERY_ASK : Action<State, {askInfo: AskAnswerInfo}> = (state, {askInfo})=>{
    const {
        rollAskAnswerInfo
    } = state || {}
    const {
        timestamp
    } = askInfo || {}    
    const newList = ([...rollAskAnswerInfo] || []).concat([{
        ...askInfo,
        status: ASK_ANSWER_STATUS.ASK,
        timeShort: dayjs(Number(timestamp)).format('YYYY-MM-DDTHH:mm:ss'),
    }])
    return {
        ...state,
        rollAskAnswerInfo: newList
    }
}


export const ADD_QUERY_ANSWER : Action<State, {answerInfo: Partial<AskAnswerInfo>}> = (state, {answerInfo})=>{
    const {
        rollAskAnswerInfo
    } = state || {}
    const {
        timestamp,
        answer,
    } = answerInfo || {}

    const newList = _.map(rollAskAnswerInfo || [], askAnswerInfo=>{
        if(askAnswerInfo?.timestamp == timestamp){
            
            return {
                ...askAnswerInfo,
                status: ASK_ANSWER_STATUS.ANSWER,
                answer: answer
            }
        }
        return askAnswerInfo;
    })

    return {
        ...state,
        rollAskAnswerInfo: newList
    }
}