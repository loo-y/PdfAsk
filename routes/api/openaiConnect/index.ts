import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai'
import _ from 'lodash'
import * as dotenv from 'dotenv'

dotenv.config()

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export const getEmbeddings = async ({ textList, retry }: { textList: string[]; retry?: number }) => {
    retry = isNaN(retry) ? 3 : retry
    if (!(retry > 0)) {
        console.log(`getEmbeddings failed, retry:`, retry)
        return []
    }
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: textList,
        })

        const { data, object, model, usage } = response?.data || {}

        if (!_.isEmpty(data)) return data
    } catch (e) {
        retry--
        console.log(`getEmbeddingsFromOpenai error, retry`, retry)
        return getEmbeddings({ textList, retry })
    }

    return []
}

export const chatAskQuestion = async ({ content, question }: { content: string; question: string }) => {
    if (!question || !content) return false
    try {
        const messages: Array<ChatCompletionRequestMessage> = [
            {
                role: 'system',
                content: `
                You are a helpful assistant. Answer the question as truthfully as possible using the provided text, and if the answer is not contained within the text below, say "I don't know. if answer is English, translate it in Chinese."

                Context:
                ${content}`,
            },
            { role: 'user', content: question },
        ]
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
        })

        const { choices } = response?.data || {}
        console.log(`🐹🐹🐹messages🐹🐹🐹`, messages)
        console.log(`🐹🐹🐹chatAskQuestion🐹🐹🐹`, response?.data)
        return choices[0].message || false
    } catch (e) {
        console.log(`chatAskQuestion`, e)
    }

    return false
}
