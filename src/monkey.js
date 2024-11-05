// ==UserScript==
// @name         紳士漫畫-爬取信息
// @description  紳士漫畫-爬取信息
// @version      1.0
// @namespace    http://tampermonkey.net/
// @author       Jimmy
// @match        https://www.baidu.com/
// @require      https://cdn.bootcss.com/jquery/3.7.1/jquery.min.js
// @run-at       document-end
// @include      https://v1.wzip.download
// @connect      *
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    const flowDefinition = {
        listPage: {
            url: "https://www.wn04.cc/albums-index-page-${pageNum}-cate-10.html",
            type: "fetchHtml",
            fields: [
                {
                    key: "manhuaList",
                    type: "arrayObject",
                    selector: "$(current).find('.gallary_item')",
                    fields: [
                        {
                            key: "title",
                            type: "simple",
                            selector: "$(current).find('.title a').attr('title')"
                        },
                        {
                            key: "url",
                            type: "simple",
                            selector: "$(current).find('.title a').attr('href')"
                        }
                    ]
                },
                {
                    key: "hasNextPage",
                    type: "simple",
                    selector: "$(current).find('.next a').text()"
                }
            ]
        },
        detailPage: {
            collection: "context.listPage.manhuaList",
            url: "'https://www.wn04.cc' + item.url",
            type: "fetchHtml",
            fields: [
                {
                    key: "title",
                    type: "simple",
                    selector: "$(current).find('.userwrap h2').text()"
                },
                {
                    key: "pageNum",
                    type: "simple",
                    selector: "$(current).find('.asTBcell.uwconn').children('label:last').text()"
                }
            ]
        }
    }

    callFlow(flowDefinition, 1)

    async function callFlow(flowDefinition, pageNum) {
        if (pageNum > 1) return
        const flowInst = JSON.parse(JSON.stringify(flowDefinition))
        flowInst.listPage.url = flowInst.listPage.url.replace("${pageNum}", pageNum)
        console.log(`请求列表:${flowInst.listPage.url}`)

        const context = {}

        const listPageData = await request(flowInst.listPage)

        const listPageInfo = handleFields(listPageData, flowInst.listPage.fields, flowInst.listPage.type)

        context.listPage = listPageInfo

        if (flowInst.detailPage) {
            const list = eval(flowInst.detailPage.collection)
            const detailPageInfoList = []
            for (const item of list) {
                try {
                    flowInst.detailPage.url = eval(flowDefinition.detailPage.url)
                } catch (e) {
                    console.error("执行出错, 脚本:", flowDefinition.detailPage.url)
                    throw e
                }
                console.log(`请求详情:${flowInst.detailPage.url}`)
                const detailPageData = await request(flowInst.detailPage)
                const detailPageInfo = handleFields(detailPageData, flowInst.detailPage.fields, flowInst.detailPage.type)
                detailPageInfoList.push(detailPageInfo)
            }
            context.detailPage = detailPageInfoList
        }

        console.log(context)

        const hasNextPage = context.listPage.totalPage && pageNum < context.listPage.totalPage || context.listPage.hasNextPage
        if (hasNextPage) {
            callFlow(flowDefinition, pageNum + 1)
        }
    }

    function handleFields(current, fields, type) {
        const info = {}
        const extractValueFn = type === "fetchJson" ? extractValueJsonPath : extractValueSelector
        if (fields) {
            for (const field of fields) {
                const key = field.key
                if (field.type === "simple") {
                    const value = extractValueFn(current, field)
                    info[key] = value
                } else if (field.type === "arraySimple") {
                    const value = extractValueFn(current, field)
                    info[key] = value
                } else if (field.type === "arrayObject") {
                    const elements = extractValueFn(current, field)
                    const value = []
                    for (const element of elements) {
                        const subInfo = handleFields(element, field.fields, type)
                        value.push(subInfo)
                    }
                    info[key] = value
                } else {
                    // 待扩展
                }
            }
        }
        return info
    }

    function extractValueSelector(current, field) {
        try {
            return eval(field.selector)
        } catch (e) {
            console.error("执行出错, 脚本:", field.selector)
            throw e
        }
    }

    function extractValueJsonPath(current, field) {
        const wrap = false
        return JSONPath.JSONPath({ path: field.jsonPath, json: current, wrap: wrap })
    }

    function request(config) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: config.method,
                url: config.url,
                headers: config.headers,
                data: config.data,
                onload: response => {
                    if (response.status === 200) {
                        // 获取某个特定的响应头，比如 "Content-Type"
                        const contentType = response.responseHeaders.match(/Content-Type:\s*(.*)\s*/i);
                        if (contentType) {
                            console.log("Content-Type: ", contentType[1]);
                            if (contentType[1].indexOf("json") >=0 ) {
                                resolve(JSON.parse(response.responseText))
                                return
                            }
                        }
                        const domParser = new DOMParser()
                        const doc = domParser.parseFromString(response.responseText, 'text/html')
                        resolve(doc)
                    } else {
                        reject(response)
                    }
                },
                onerror: response => {
                    reject(response)
                }
            })
        })
    }
    function doEval(script) {
        try {
            return eval(script)
        } catch (e) {
            console.error("执行出错, 脚本:", script)
            throw e
        }
    }
})()