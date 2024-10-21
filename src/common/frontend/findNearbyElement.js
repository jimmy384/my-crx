import $ from 'jquery'

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

export default findNearbyElement