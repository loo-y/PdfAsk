import _ from 'lodash'
import { BaseState } from 'react-imvc'

type AnyObj = { [index: string]: any }
type InitialState = { pdfile?: any }

export type State = BaseState & InitialState

export const initialState = {

}