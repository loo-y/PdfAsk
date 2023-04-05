import _ from 'lodash'
export const sleep = async (sec?: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, (Number(sec) || 1) * 1000)
    })
}

export const getLowercaseQuery = (query, cleanNonLowercase = true) => {
    if (!query) {
        return query
    }
    let nonLowercaseKeys = []
    // query key 全部转小写
    for (let key of Object.keys(query)) {
        query[key.toLowerCase()] = query[key]
        if (key !== key.toLowerCase()) {
            nonLowercaseKeys.push(key)
        }
    }
    if (cleanNonLowercase) {
        for (let i = 0; i < nonLowercaseKeys.length; i++) {
            delete query[nonLowercaseKeys[i]]
        }
    }
    return query
}
