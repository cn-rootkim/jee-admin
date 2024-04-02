import http from '../../utils/http/http.js'

const add = (data) => {
    return http.post('/sysApi/add', data)
}
const batchDelete = (data) => {
    return http.post('/sysApi/batchDelete', data)
}
const update = (data) => {
    return http.post('/sysApi/update', data)
}
const idListAuthorized = (data) => {
    return http.post('/sysApi/idListAuthorized', data)
}
export default {
    add,batchDelete,update,idListAuthorized
}