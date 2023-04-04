import * as crypto from 'crypto'

export const sha256 = (data?: string): string => {
    if (!data?.length) data = String(new Date().getTime())
    data = encodeURIComponent(data)
    const hash = crypto.createHash('sha256')
    hash.update(data)
    return hash.digest('hex')
}

export const sha256_16bit = (data?: string): string => {
    const hash = sha256(data)
    return hash.slice(0, 16)
}

export const executeInOrder = async (promises: Array<() => Promise<any>>) => {
    for (const promise of promises) {
        await promise()
    }
}
