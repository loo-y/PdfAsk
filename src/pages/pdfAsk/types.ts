export type LONG_CONTEXT_TYPE = {page: number, textlines: Array<string>}

export enum PDF_UPLOAD_STATUS {
    UNLOAD = 0,
    SUCCESS = 1,
    FAILED = -1,
    LOADING = 99,
}