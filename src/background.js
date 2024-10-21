import { AxiosError } from 'axios';
import httpRequest from './common/background/httpRequest'

const CLIENT_ERROR_CODE = "ClientError"

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
 *     config: {
 *         method: "POST",
 *         url: "/api/v1/user",
 *         params: {
 *             "id": 123    
 *         },
 *         data: {},
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
            const requestConfig = message.config
            requestConfig.baseURL = result.backendUrl
            requestConfig.url = requestConfig.url
            httpRequest.request(requestConfig)
                .then(body => {
                    // 服务器返回200
                    sendResponse(body)
                })
                .catch(error => {
                    if (error instanceof AxiosError) {
                        // 客户端请求发送失败
                        sendResponse({
                            success: false,
                            errCode: CLIENT_ERROR_CODE,
                            errMsg: error.message,
                            data: error
                        })
                    } else {
                        // 服务器返回非200
                        sendResponse(error);
                    }
                })
        });
    }
    return true;
})
