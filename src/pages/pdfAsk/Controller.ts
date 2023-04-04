import React from 'react'
import _ from 'lodash'
import View from './View'
import * as Model from './Model'
import Controller from 'react-imvc/controller'
import { Location, Context, SSR } from 'react-imvc'
import { LONG_CONTEXT_TYPE, PDF_UPLOAD_STATUS } from './types'
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
        const url = `/api/query`
        const { namespace } = this.store.getState()
        try{
            const params = {
                text,
                namespace,
            }
            const resp = await this.post(url, params)
            console.log(`相关回答: \n`,resp?.result?.content || resp?.error)
            return resp;
        }catch(e){
            return null
        }
    }
    /************************* helper **************************/

    /************************* handler **************************/

    handleSetPageContentList = (pagesContentList)=>{
        const { UPDATE_STATE } = this.store.actions || {}
        UPDATE_STATE({
            pagesContentList
        })
    }
    handleUPloadPdf = async(filename)=>{
        const { UPDATE_STATE } = this.store.actions || {}
        UPDATE_STATE({uploadStatus: PDF_UPLOAD_STATUS.LOADING })
        const { pagesContentList } = this.store.getState() || {}
        let longContextList: Array<LONG_CONTEXT_TYPE> = [];
        _.map(pagesContentList, pageContentList=>{
            const {
                page,
                contentList
            } = pageContentList || {}
            let longContext: LONG_CONTEXT_TYPE  = {
                page,
                textlines: []
            }
            let thisLine = '', lastTransformString = '';
            _.map(contentList, (content, contentIndex: number)=>{
                const {
                    transform, str
                } = content || {}
                const sameLineTrans = (transform.slice(0, 4).concat([transform[transform.length-1]])).join(',')
                if(!lastTransformString || (sameLineTrans == lastTransformString)){
                    thisLine += str;
                    if(contentIndex == contentList.length - 1){
                        longContext.textlines.push(thisLine)
                    }
                } else {
                    longContext.textlines.push(thisLine)
                    thisLine = str;
                }
                lastTransformString = sameLineTrans
            })

            longContextList.push({
                ...longContext
            })
        })

        console.log(longContextList)

        const url = `/api/sendpdf`
        try{
            const params = {
                longContextList,
                pdfName: filename,
            }
            const resp = await this.post(url, params)
            const { namespace } = resp || {}
            const { UPDATE_STATE } = this.store.actions || {}
            UPDATE_STATE({
                namespace,
                uploadStatus: PDF_UPLOAD_STATUS.SUCCESS,
            })
            return true;
        }catch(e){
           console.log(`handleUploadPdf error`, e) 
        }
        UPDATE_STATE({uploadStatus: PDF_UPLOAD_STATUS.FAILED})
        return false;
    }

    handleGetAnswer = async (text)=>{
        const trimText = _.trim(text)
        if(!(trimText.length > 0)) return false;
        const now = new Date()
        const { ADD_QUERY_ASK, ADD_QUERY_ANSWER } = this.store.actions || {}
        ADD_QUERY_ASK({
            askInfo: {
                timestamp: now.getTime(),
                question: trimText,
            }
        })
        const resultQuery = await this.fetchQuery(trimText)

        ADD_QUERY_ANSWER({
            answerInfo: {
                timestamp: now.getTime(),
                answer: resultQuery?.result?.content || `没有找到相关的内容`,
            }
        })
        
        return true;
    }
}