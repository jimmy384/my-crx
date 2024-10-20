const maxTime = 2000
const interval = 30

const defaulNotFoundCallback = () => {
    alert("查找相关元素失败")
}

function watchElement(findElement, foundCallback, notFoundCallback, depth) {
    notFoundCallback = notFoundCallback || defaulNotFoundCallback
    depth = depth || 0;
    if (depth > maxTime / interval) {
        console.log(`查找相关元素超时, 重试次数:${depth}`)
        notFoundCallback()
        return
    } else {
        const elements = findElement()
        if (elements == null || elements.length === 0) {
            console.log(`${interval}ms后尝试第${depth}次重试`)
            setTimeout(() => {
                watchElement(findElement, foundCallback, notFoundCallback, depth + 1)
            }, interval)
        } else {
            console.log(`第${depth}次重试成功`)
            foundCallback(elements)
        }
    }
}

export default watchElement