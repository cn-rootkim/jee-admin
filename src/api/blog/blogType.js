import http from '../../utils/http/http.js'

const add = (data) => {
    return http.post('/blogType/add', data)
}
const batchDelete = (data) => {
    return http.post('/blogType/batchDelete', data)
}
const update = (data) => {
    return http.post('/blogType/update', data)
}
const listTree = () => {
    return http.post('/blogType/listTree')
}
export default {
    add,
    batchDelete,
    update,
    listTree,
}