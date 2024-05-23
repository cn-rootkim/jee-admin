import http from '../../utils/http/http.js'

const add = (data) => {
    return http.post('/sysApiBasePath/add', data)
}
const batchDelete = (data) => {
    return http.post('/sysApiBasePath/batchDelete', data)
}
const update = (data) => {
    return http.post('/sysApiBasePath/update', data)
}
const list = (data) => {
    return http.post('/sysApiBasePath/list', data)
}
export default {
    add,batchDelete,update,list
}