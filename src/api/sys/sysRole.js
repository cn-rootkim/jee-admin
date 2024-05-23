import http from '../../utils/http/http.js'

const add = (data) => {
    return http.post('/sysRole/add', data)
}
const batchDelete = (data) => {
    return http.post('/sysRole/batchDelete', data)
}
const update = (data) => {
    return http.post('/sysRole/update', data)
}
const page = (data) => {
    return http.post('/sysRole/page', data)
}
const list = () => {
    return http.post('/sysRole/list', null)
}
const authMenu = (data) => {
    return http.post('/sysRole/authMenu', data)
}
const authMenuFunction = (data) => {
    return http.post('/sysRole/authMenuFunction', data)
}
const authApi = (data) => {
    return http.post('/sysRole/authApi', data)
}
export default {
    add,batchDelete,update,page,list,authMenu,authMenuFunction,authApi
}