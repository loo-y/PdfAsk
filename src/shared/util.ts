import _ from 'lodash'
export const sleep = async (sec?: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, (Number(sec) || 1) * 1000)
    })
}
