import $ from 'jquery'
import watchElement from './common/frontend/watchElement'
import findNearbyElement from './common/frontend/findNearbyElement'
import sendRequest from './common/frontend/chrome'

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

    const toggleSwitchHtaml = `
        <div class="switch">
            <span>MR检视模式</span>
            <input id="toggle" type="checkbox" class="switch-checkbox">
            <label class="switch-label" for="toggle">
                <span class="switch-inner"></span>
                <span class="switch-switch"></span>
            </label>
        </div>
    `
    $("#form").append(toggleSwitchHtaml)

    // 添加事件监听器
    $("#toggle").on("change", () => {
        const toggle = document.getElementById('toggle');
        console.log(toggle.checked)
    })

    /*
    sendRequest({
        method: "post",
        path: "/test",
        params: { "name": "jimmy" }
    }).then(data => {
        console.log("请求结果:", data)
    })

    const findElement = () => findNearbyElement("账号", 'input')
    watchElement(findElement)
        .then(element => {
            console.log("找到的元素: ", element)
        })
        .catch(err => {
            alert("查找相关元素失败", err)
        })
    */
});