import http from '../../utils/http/http.js'
import { Encrypt, Decrypt } from '../../utils/aes.js';

const add = (data) => {
    data.password = Encrypt(data.password)
    return http.post('/sysUser/add', data)
}
const batchDelete = (data) => {
    return http.post('/sysUser/batchDelete', data)
}
const update = (data) => {
    data.password = Encrypt(data.password)
    return http.post('/sysUser/update', data)
}
const page = (data) => {
    return http.post('/sysUser/page', data)
}
const info = (data) => {
    return http.post('/sysUser/info', data)
}
const loginByUsernameAndPassword = (data) => {
    data.password = Encrypt(data.password)
    return http.post('/sysUser/loginByUsernameAndPassword', data)
}
const logout = () => {
    return http.post('/sysUser/logout')
}
export default {
    add,batchDelete,update,page,info,loginByUsernameAndPassword,logout
}