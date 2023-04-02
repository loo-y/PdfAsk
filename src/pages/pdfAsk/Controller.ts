import React from 'react'
import _ from 'lodash'
import View from './View'
import * as Model from './Model'
import Controller from 'react-imvc/controller'
import { Location, Context, SSR } from 'react-imvc'
import { LONG_CONTEXT_TYPE } from './types'
import { sleep } from '../../shared/util'

export type Action = Omit<typeof Model, 'initialState'>
export default class PdfAskController extends Controller<Model.State, Action> {
    SSR?: SSR = this.location.query.ssr !== 'false'
    View = View
    Model = Model
    ctrl = this as any

    /************************* Life Cycle **************************/
    constructor(location: Location, context: Context) {
        super(location, context)
    }

    getInitialState(initialState) {
        let state = super.getInitialState(initialState)
        return {
            ...state,
        }
    }

    shouldComponentCreate() {
        console.log(`shouldComponentCreate`, this.store.getState())
        return true
    }

    async componentWillCreate() {
        console.log(`componentWillCreate`)
    }

    async componentDidFirstMount() {
        console.log(`componentDidFirstMount`)

    }

    async componentDidMount() {
        console.log(`componentDidMount`)
    }

    /************************* fetch **************************/

    fetchQuery = async (text)=>{
    }
    /************************* helper **************************/

    /************************* handler **************************/

    handleSetPageContentList = (pagesContentList)=>{
        const { UPDATE_STATE } = this.store.actions || {}
        UPDATE_STATE({
            pagesContentList
        })
    }
    handleUPloadPdf = async()=>{
        const { pagesContentList } = this.store.getState() || {}
        await sleep(3)
        if(_.isEmpty(pagesContentList)) return false;
        return true;
    }

    handleGetAnswer = async (text)=>{
        const result = await this.fetchQuery(text)
    }
}