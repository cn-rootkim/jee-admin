import http from '../../utils/http/http.js'

const add = (data) => {
    return http.post('/adminMenuFunction/add', data)
}
const batchDelete = (data) => {
    return http.post('/adminMenuFunction/batchDelete', data)
}
const update = (data) => {
    return http.post('/adminMenuFunction/update', data)
}
const list = (data) => {
    return http.post('/adminMenuFunction/list', data)
}
export default {
    add,
    batchDelete,
    update,
    list,
}