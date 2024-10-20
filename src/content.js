import $ from 'jquery'
import watchElement from './common/watchElement.js'
import findNearbyElement from './common/findNearbyElement.js'

console.log("content.js 加载成功")
$(document).ready(() => {
    console.log("jquery ready")
    // 使用jQuery找到页面的第一个输入框
    var firstInput = $('input:first')
    if (firstInput.length) {
        firstInput.css('border', '2px solid red'); // 给它添加一个红色边框以示识别
        console.log("找到的第一个输入框: ", firstInput)

        const message = { action: "forwardRequest", path: "/test", method: "POST", param: { "name": "jimmy" } }
        chrome.runtime.sendMessage(message, response => {
            console.log("保存设置结果:", response)
        })
    } else {
        console.log("没有找到输入框")
    }

    const findElement = () => findNearbyElement("昵称", 'input')
    watchElement(findElement, () => {
        console.log("找到昵称输入框")
    })

    // console.log(findNearbyElement("我的签名", 'textarea'))
    // console.log(findNearbyElement("出生日期", 'input'))
    // console.log(findNearbyElement("用户名", 'span'))

});