import http from '../../utils/http/http.js'

const add = (data) => {
    return http.post('/blog/add', data)
}
const batchDelete = (data) => {
    return http.post('/blog/batchDelete', data)
}
const update = (data) => {
    return http.post('/blog/update', data)
}
const page = (data) => {
    return http.post('/blog/page',data)
}
const info = (data) => {
    return http.post('/blog/info',data)
}
export default {
    add,
    batchDelete,
    update,
    page,
    info
}