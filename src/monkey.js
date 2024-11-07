// ==UserScript==
// @name         紳士漫畫-爬取信息
// @description  紳士漫畫-爬取信息
// @version      1.0
// @namespace    http://tampermonkey.net/
// @author       Jimmy
// @match        https://www.baidu.com/
// @require      https://cdn.bootcss.com/jquery/3.7.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jsonpath-plus@10.1.0/dist/index-browser-umd.min.cjs
// @run-at       document-end
// @include      https://v1.wzip.download
// @connect      *
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 抽象爬虫
     * 拥有提取字段的能力
     */
    class AbstractCrawler {
        handleFields(current, fields) {
            const info = {}
            if (fields) {
                for (const field of fields) {
                    const key = field.key
                    if (field.type === "simple" || field.type === "arraySimple") {
                        const extractValueFn = this.getExtractValueFn(field)
                        const value = extractValueFn.apply(this, [current, field])
                        info[key] = value
                    } else if (field.type === "arrayObject") {
                        const extractValueFn = this.getExtractValueFn(field)
                        const elements = this.jqueryListToArray(extractValueFn.apply(this, [current, field]))
                        const value = elements.map(element => this.handleFields(element, field.fields))
                        info[key] = value
                    } else {
                        console.warn(`不支持的类型${field.type}`)
                    }
                }
            }
            return info
        }

        getExtractValueFn(field) {
            if (field.jsonPath) {
                return this.extractValueJsonPath
            } else if (field.selector) {
                return this.extractValueSelector
            } else {
                throw new Error(`field缺少配置jsonPath或者selector, key:${field.key}`)
            }
        }

        extractValueJsonPath(current, field) {
            const wrap = false
            return JSONPath.JSONPath({ path: field.jsonPath, json: current, wrap: wrap })
        }

        extractValueSelector(current, field) {
            return this.doEval(field.selector, { current: current })
        }

        doEval(script, context) {
            const argNames = Object.keys(context)
            const argValues = Object.values(context)
            const func = new Function(argNames, "return " + script);
            try {
                return func.apply(null, argValues)
            } catch (e) {
                console.error("执行出错, 脚本:", script)
                throw e
            }
        }
    }

    /**
     * 可以处理以下类型的页面
     * 1.列表-详情页面
     * 2.单个详情页面
     */
    class ListDetailPageCrawler extends AbstractCrawler {
        /**
         * 请求页面、结果字段提取的配置
         */
        flowDefinition
        /**
         * 发送请求函数，接收一个config对象(axios格式)，返回一个Promise
         */
        sendRequestFn

        constructor(flowDefinition, sendRequestFn) {
            super()
            if (flowDefinition.listPage) {
                flowDefinition.listPage = Object.assign({}, flowDefinition.commonConfig, flowDefinition.listPage)
            }
            if (flowDefinition.detailPage) {
                flowDefinition.detailPage = Object.assign({}, flowDefinition.commonConfig, flowDefinition.detailPage)
            }
            this.flowDefinition = flowDefinition
            this.sendRequestFn = sendRequestFn
        }

        async callFlow(pageNum) {
            pageNum = !pageNum ? 1 : pageNum
            const flowInst = JSON.parse(JSON.stringify(this.flowDefinition))
            const {listPage, detailPage} = flowInst

            // 存储某一页列表页面和这一页所有详情的信息
            const context = {}

            // 请求列表页面
            if (listPage) {
                if (listPage.url) {
                    listPage.url = this.doEval("`" + listPage.url + "`", {pageNum})
                }
                if (listPage.curl) {
                    listPage.url = this.doEval("`" + listPage.curl + "`", {pageNum})
                }

                console.log("请求列表")
                const listPageData = await this.sendRequest(listPage)

                // 提取列表页面信息
                const listPageInfo = this.handleFields(listPageData, listPage.fields)
                context.listPage = listPageInfo
            }

            // 循环列表页面中的每一个详情页
            if (detailPage) {
                const evalCtx = { context }
                const isListDetailPage = detailPage.collection != null // 没有配置collection，则认为是单个详情页
                let list = isListDetailPage ? this.doEval(detailPage.collection, evalCtx) : [evalCtx]
                list = this.jqueryListToArray(list)
                const itemKey = detailPage.itemKey || "item"
                const detailPageInfoList = []
                for (const item of list) {
                    // 获取详情页地址
                    evalCtx[itemKey] = item
                    if (this.flowDefinition.detailPage.url) {
                        detailPage.url = this.doEval("`" + this.flowDefinition.detailPage.url + "`", evalCtx)
                    }
                    if (this.flowDefinition.detailPage.curl) {
                        detailPage.curl = this.doEval("`" + this.flowDefinition.detailPage.curl + "`", evalCtx)
                    }
                    // 请求详情页面
                    console.log(`请求详情`)
                    const detailPageData = await this.sendRequest(detailPage)
                    const detailPageInfo = this.handleFields(detailPageData, detailPage.fields)
                    detailPageInfoList.push(detailPageInfo)
                    break
                }
                context.detailPage = detailPageInfoList
            }

            console.log(context)

            // 抓取下一页
            if (listPage) {
                const hasNextPage = context.listPage.totalPage && pageNum < context.listPage.totalPage || context.listPage.hasNextPage
                if (hasNextPage) {
                    // this.callFlow(flowDefinition, pageNum + 1)
                }
            }
        }

        async sendRequest(config) {
            const requestInfo = await this.parseCurl(config.curl)
            if (requestInfo) {
                if (requestInfo.params) {
                    config.url = config.url + "?" + new URLSearchParams(requestInfo.params).toString()
                } else {
                    config.url = requestInfo.url
                }
                config.method = requestInfo.method
                config.headers = requestInfo.headers || {}
                config.data = requestInfo.body
            }
            return this.sendRequestFn(config)
        }

        async parseCurl(curl) {
            return null
        }

        jqueryListToArray(list) {
            return list.jquery ? list.toArray() : list
        }
    }

    const flowDefinition = {
        listPage: {
            url: "https://www.wn04.cc/albums-index-page-${pageNum}-cate-10.html",
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
            url: "https://www.wn04.cc${item.url}",
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

    const crawler = new ListDetailPageCrawler(flowDefinition, sendRequestFn)
    crawler.callFlow()

    async function sendRequestFn(config) {
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
                            if (contentType[1].indexOf("json") >= 0) {
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
                onerror: err => {
                    reject(err)
                }
            })
        })
    }

})()