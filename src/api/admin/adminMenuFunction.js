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
const idListAuthorized = (data) => {
    return http.post('/adminMenuFunction/idListAuthorized', data)
}
const nameListAuthorized = (data) => {
    return http.post('/adminMenuFunction/nameListAuthorized', data)
}
export default {
    add,
    batchDelete,
    update,
    list,
    idListAuthorized,
    nameListAuthorized
}