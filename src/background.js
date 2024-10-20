import { AxiosError } from 'axios';
import httpRequest from './common/httpRequest.js'

// 
/**
 * 读取配置参数
 * 入参:
 * {
 *     action: "getConfig"
 * }
 * 返回值：
 * {
 *     key1: value1
 * }
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getConfig") {
        chrome.storage.local.get(null, result => {
            sendResponse(result);
        });
    }
    return true;
});

/**
 * 保存配置参数
 * 入参:
 * {
 *     action: "saveConfig",
 *     settings: {
 *         key1: value1
 *     }
 * }
 * 返回值：
 * {
 *     success: true
 * }
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveConfig") {
        chrome.storage.local.set(message.settings, () => {
            console.log("配置参数已保存");
            sendResponse({ "success": true });
        });
    }
    return true;
});

/**
 * 发送请求
 * 入参:
 * {
 *     action: "sendRequest",
 *     method: "POST",
 *     path: "/api/v1/user",
 *     params: {
 *         "id": 123    
 *     },
 *     data: {},
 *     config: {
 *         headers: {
 *             "Authorization": "Bearer xxx"
 *         },
 *         ...其他axios配置
 *     }
 * }
 * 返回值：
 * {
 *     success: true,
 *     data: {},
 *     errCode: "", // 客户端本地发生错误时, errCode=ClientError, 服务端发生错误时, 错误码由后端给出
 *     errMsg: ""
 * }
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendRequest") {
        chrome.storage.local.get(null, result => {
            const method = message.method
            const url = result.backendUrl + message.path
            if (method === "GET") {
                httpRequest.get(url, message.params, message.config)
                    .then(body => {
                        sendResponse(body)
                    }, body => {
                        handleError(body, sendResponse) 
                    })
            } else if (method === "POST") {
                httpRequest.post(url, message.params, message.data, message.config)
                    .then(body => {
                        sendResponse(body)
                    }, body => {
                        handleError(body, sendResponse) 
                    })
            } else if (method === "PUT") {
                httpRequest.put(url, message.params, message.data, message.config)
                    .then(body => {
                        sendResponse(body)
                    }, body => {
                        handleError(body, sendResponse) 
                    })
            } else if (method === "DELETE") {
                httpRequest.del(url, message.params, message.data, message.config)
                    .then(body => {
                        sendResponse(body)
                    }, body => {
                        handleError(body, sendResponse) 
                    })
            } else {
                sendResponse({
                    "success": false,
                    "errCode": "ClientError",
                    "errMsg": `background script的sendRequest不支持${httpRequest.method}请求方法`
                })
            }

            // fetch(url, {
            //     method: message.method,
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(message.param),
            // }).then(response => {
            //     if (response.status !== 200) {
            //         throw new Error(`请求失败, 响应码:${response.status}`)
            //     }
            //     return response.json()
            // }).then(data => {
            //     console.log("处理接口返回数据", data);
            //     sendResponse(data);
            // }).catch(error => {
            //     console.error('请求出错:', error);
            // });
        });
    }
    return true;
})

function handleError(body, sendResponse) {
    let errorResult;
    if (body instanceof AxiosError) {
        errorResult = {
            success: false,
            errCode: "ClientError",
            errMsg: body.message,
            data: body
        }
    } else {
        errorResult = body
    }
    sendResponse(errorResult);
}