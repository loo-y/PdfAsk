export type LONG_CONTEXT_TYPE = {page: number, textlines: Array<string>}
export type AnyObj = { [index: string]: any }
export enum PDF_UPLOAD_STATUS {
    UNLOAD = 0,
    SUCCESS = 1,
    FAILED = -1,
    LOADING = 99,
}