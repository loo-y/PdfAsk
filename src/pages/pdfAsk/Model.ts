import _ from 'lodash'
import { BaseState } from 'react-imvc'

type InitialState = { pdfile?: any, pagesContentList: [] }

export type State = BaseState & InitialState

export const initialState = {

}