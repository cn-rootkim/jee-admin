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
const listTree = () => {
    return http.post('/adminMenu/listTree')
}
const list = () => {
    return http.post('/adminMenu/list')
}
const listAuthorized = (data) => {
    return http.post('/adminMenu/listAuthorized',data)
}
const listTreeAuthorized = () => {
    return http.post('/adminMenu/listTreeAuthorized')
}
export default {
    add,
    batchDelete,
    update,
    listTree,
    list,
    listAuthorized,
    listTreeAuthorized
}