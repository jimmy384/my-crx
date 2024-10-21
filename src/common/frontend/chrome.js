/**
 * 发送请求，发消息给background script，实际请求由background script发送
 * 此方法是给content script调用的
 */
export default function sendRequest(config) {
    const message = {
    action: "sendRequest",
        config: config
    }
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, data => {
            // TODO 看情况要不要解析到错误就调reject
            resolve(data)
        })
    })
}