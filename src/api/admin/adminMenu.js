import http from '../../utils/http/http.js'

const add = (data) => {
    return http.post('/adminMenu/add', data)
}
const batchDelete = (data) => {
    return http.post('/adminMenu/batchDelete', data)
}
const update = (data) => {
    return http.post('/adminMenu/update', data)
}
const listTree = (data) => {
    return http.post('/adminMenu/listTree', data)
}
export default {
    add,
    batchDelete,
    update,
    listTree,
}