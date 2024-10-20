import axios from "axios"

const handleResponse = (response) => {
    // 目前直接透传
    return response.data
}

const get = async (url, params, config) => {
    const response = await axios.get(url, {
        params,
        ...config
    })
    return handleResponse(response)
}

const post = async (url, params, data, config) => {
    const response = await axios.post(url, data, {
        params,
        ...config
    })
    return handleResponse(response)
}

const put = async (url, params, data, config) => {
    const response = await axios.put(url, data, {
        params,
        ...config
    })
    return handleResponse(response)
}

const del = async (url, params, data, config) => {
    if (data) {
        config.data = data
    }
    const response = await axios.delete(url, {
        params,
        ...config
    })
    return handleResponse(response)
}

export default {
    get,
    post,
    put,
    del
}