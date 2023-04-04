export type LONG_CONTEXT_TYPE = { page: number; textlines: Array<string> }
export type AnyObj = { [index: string]: any }
export enum PDF_UPLOAD_STATUS {
    UNLOAD = 0,
    SUCCESS = 1,
    FAILED = -1,
    LOADING = 99,
}

export enum ASK_ANSWER_STATUS {
    ASK = 0,
    ANSWER = 1,
    LOADING = 99,
    FAILED = -1,
}
export type AskAnswerInfo = {
    answer?: string
    question: string
    status?: ASK_ANSWER_STATUS
    timeShort?: string
    timestamp: number
}
