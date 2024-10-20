import $ from 'jquery'
import watchElement from './common/watchElement.js'
import findNearbyElement from './common/findNearbyElement.js'

console.log("content.js 加载成功")
$(document).ready(() => {
    console.log("jquery ready")
    // 使用jQuery找到页面的第一个输入框
    var firstInput = $('input:first')
    if (firstInput.length) {
        // 给它添加一个红色边框以示识别
        firstInput.css('border', '2px solid red')
        console.log("找到的第一个输入框: ", firstInput)
    } else {
        console.log("没有找到输入框")
    }

    const message = {
        action: "sendRequest",
        method: "POST",
        path: "/test",
        params: { "name": "jimmy" }
    }
    chrome.runtime.sendMessage(message, response => {
        console.log("请求结果:", response)
    })

    start()

    // const findElement = () => findNearbyElement("账号", 'input')
    // watchElement(findElement)
    //     .then(element => {
    //         console.log("找到的元素: ", element)
    //     })
    //     .catch(err => {
    //         alert("查找相关元素失败")
    //     })

    async function start() {
        const findElement = () => findNearbyElement("账号", 'input')
        try {
            const element = await watchElement(findElement)
            console.log("找到的元素: ", element)
        } catch (err) {
            console.log("查找相关元素失败")
            alert("查找相关元素失败")
        }

    }
});