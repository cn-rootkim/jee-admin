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
const authAdminMenu = (data) => {
    return http.post('/sysRole/authAdminMenu', data)
}
const authAdminMenuFunction = (data) => {
    return http.post('/sysRole/authAdminMenuFunction', data)
}
const authSysApi = (data) => {
    return http.post('/sysRole/authSysApi', data)
}
export default {
    add,batchDelete,update,page,list,authAdminMenu,authAdminMenuFunction,authSysApi
}