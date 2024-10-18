import $ from 'jquery'

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

    // const nameInput = findNearbyElement("昵称", 'input')
    // console.log(nameInput)
    // console.log(findNearbyElement("我的签名", 'textarea'))
    // console.log(findNearbyElement("出生日期", 'input'))
    // console.log(findNearbyElement("用户名", 'span'))

    // setElementValue(nameInput, "jimmy")


    function findNearbyElement(labelText, tagType) {
        const label = $(`*:contains('${labelText}')`)
            .filter((index, item) => {
                return $(item).children().length === 0
            })
            .first()
        return doFindNearbyElement(label, tagType, 1)
    }

    function doFindNearbyElement(fromElement, tagType, depth) {
        if (depth > 3) {
            return null
        }
        const element = fromElement.nextAll().find(tagType).first()
        if (element.length === 0) {
            const newFromElement = fromElement.parent()
            if (newFromElement.length === 0) {
                return null
            } else {
                return doFindNearbyElement(newFromElement, tagType, depth + 1)
            }
        } else {
            return element
        }
    }

    function setElementValue(element, value) {
        $(element).val(value).trigger('input');
    }
});