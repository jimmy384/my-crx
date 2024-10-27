import axios from "axios"

const get = async (url, config) => {
    config.method = "get"
    config.url = url
    return request(config)
}

const post = async (url, config) => {
    config.method = "post"
    config.url = url
    return request(config)
}

const put = async (url, config) => {
    config.method = "put"
    config.url = url
    return request(config)
}

const del = async (url, config) => {
    config.method = "delete"
    config.url = url
    return request(config)

}

const request = config => {
    return axios(config)
        .then(response => Promise.resolve(response.data))
}

export default {
    get,
    post,
    put,
    del,
    request
}