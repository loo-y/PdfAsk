import {  Router } from 'express'
import _ from 'lodash'
import { getEmbeddings, chatAskQuestion } from './openaiConnect'
import { getIndex, createIndex, insert, findSimilar, deleteAllVectors} from './pineconeConnect/direct'
import { splitTextInDoc, } from './contexts'


const router = Router()
export default function (app) {
    app.use('/api', router)
}

const openaiPineconeIndex = 'openai'
const testNamespace = `openaiNamespace`
router.use('/deleteAllVectors', async (req, res, next) => {
    const i = await deleteAllVectors({index: openaiPineconeIndex, namespace: testNamespace})
    res.status(200).send(i)
})

router.post("/sendpdf",  async (req, res, next) => {
    const {
        longContextList
    } = req?.body || {}

    const docs = await splitTextInDoc({
        longContextList,
    })
    if(!docs){
        return res.status(200).json(docs)
    }
    console.log(`sendpdf`, docs)

    const chunkDocsList = _.chunk(docs, 5)

    await Promise.all(_.map(chunkDocsList, (chunkDocs, chunkIndex)=>{
        return new Promise(async(resolve, reject)=>{
            const textList = _.map(chunkDocs, (doc)=>{
                const {
                    pageContent, metadata
                } = doc || {}
                return pageContent
            });
            const vectors = await getEmbeddings({
                textList
            })
            const completedVectors = _.map(vectors, (vector, index)=>{
                return {
                    id: `pdf-${chunkIndex}-${index}`,
                    values: vector?.embedding || [],
                    metadata: chunkDocs[index]?.metadata || {},
                }
            })
            console.log(`vertors from getEmbeddings completedVectors`, completedVectors)
            await insert({
                index: openaiPineconeIndex,
                vectors: completedVectors,
                namespace: testNamespace
            })
            resolve(true);
        })
    }))

    return res.status(200).json(docs)
})


router.post('/query', async(req, res, next)=>{
    const {
        text,
    } = req?.body || {}
    if(!text) return res.status(200).json({error: `no text`})

    const queryVectors = await getEmbeddings({
        textList: [text]
    })
    const queryVector = queryVectors?.[0]?.embedding;
    if(_.isEmpty(queryVector)){
        return res.status(200).json({error: `fail query vector`})
    }

    const result = await findSimilar({
        index: openaiPineconeIndex,
        namespace: testNamespace,
        vector: queryVector
    })

    if(_.isEmpty(result?.[0])) return res.status(200).json({error: false})

    const getAllContentOverSeven = _.compact(_.map(result, r=>{
        const {
            metadata,
            score
        } = r ||{}
        if((score > 0.7) && metadata?.pageContent){
            return metadata.pageContent
        }else{
            return null
        }
    }))
    console.log(`🐹🐹🐹original result🐹🐹🐹`, result)
    console.log(`getAllContentOverSeven`, getAllContentOverSeven)
    if(!getAllContentOverSeven?.length) return res.status(200).json({error: `no similar result`})

    const answer = await chatAskQuestion({
        content: getAllContentOverSeven.join('\n'), question: text
    })
    return res.status(200).json({result: answer})
})