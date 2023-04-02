import _ from 'lodash'
import { defaultDocLength } from './constants';
import { Document } from './types'

const endRegs = /[\.\!！。]/;
const lastEndRegs = /[\.\!！。][^\.\!！。]*$/;
export const splitTextInDoc = ({
    longContextList, docLength
}: {longContextList: Array<{textlines: Array<string>, page: number}>, docLength?: number})=>{
    if(!longContextList?.length) return false

    const splitDocLength = docLength || defaultDocLength
    // 先根据换行符分割
    let docs: Array<Document> = [], _doc_text = '',  newPageLineLength = 0;

    let sentence = "", pageList: any = [], flattenSentenceList: any = [];
    longContextList.sort((a, b)=>{
        return a.page - b.page
    })
    _.map(longContextList, longContext=>{
        const {
            textlines, page
        } = longContext || {}
        pageList.push(page)
        _.map(textlines, (textline, lineIndex)=>{
            const is_end_index = textline.match(endRegs)?.index || -1
            if(is_end_index>=0){
                flattenSentenceList.push({
                    sentence: sentence + textline.slice(0, is_end_index + 1),
                    pageList: [...pageList],
                })
                
                sentence = textline.slice(is_end_index + 1);
                // pageList 重新计算
                // 如果是当页的最后一行，而且句子在此行末尾结束，则不要把当页加入pageList
                pageList = ((lineIndex + 1 == textlines.length) && (is_end_index + 1 == textline.length)) ? [] : [page]
            }else{
                sentence += textline;
            }
        })
    })

    // 补上最后一句
    if(sentence.length){
        flattenSentenceList.push({
            sentence,
            pageList: [...pageList],
        })
    }

    console.log(`🐹🐹🐹flattenSentenceList🐹🐹🐹`, flattenSentenceList)
    let currentPageList: any = []
    _.map(flattenSentenceList, sentenceItem => {
        const {
            sentence,
            pageList,
        } = sentenceItem || {}
        if(sentence.length + _doc_text.length > splitDocLength){
            docs.push({
                pageContent: _doc_text,
                metadata: {page: currentPageList.join(','), pageContent: _doc_text},
            })
            _doc_text = sentence;
            currentPageList = [...pageList]
        }else{
            _doc_text += sentence;
            currentPageList = _.uniq(currentPageList.concat([...pageList]))
        }
    })

    // 补上最后一段
    if(_doc_text.length){
        docs.push({
            pageContent: _doc_text,
            metadata: {page: currentPageList.join(','), pageContent: _doc_text},
        })
    }


    return docs;
}


// 向量相似度对比
/**
 *    使用示例：
    const a: number[] = [1, 2, 3];
    const b: number[] = [4, 5, 6];
    
    const similarity: number = cosineSimilarity(a, b);
    console.log(similarity); // Output: 0.9746318461970762
*/

export const cosineSimilarity = (a: number[], b: number[]): number=> {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same length');
    }
  
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
  
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
  
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}