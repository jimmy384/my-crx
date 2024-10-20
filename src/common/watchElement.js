const maxTime = 2000
const interval = 30

function watchElement(findElement, depth) {
    return new Promise((resolve, reject) => {
        depth = depth || 0;
        if (depth > maxTime / interval) {
            console.log(`查找相关元素超时, 重试次数:${depth}`)
            reject(depth)
        } else {
            const elements = findElement()
            if (elements == null || elements.length === 0) {
                console.log(`${interval}ms后尝试第${depth}次重试`)
                setTimeout(() => {
                    resolve(watchElement(findElement, depth + 1))
                }, interval)
            } else {
                console.log(`第${depth}次重试成功`)
                resolve(elements)
            }
        }
    })
}

export default watchElement