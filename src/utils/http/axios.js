import axios from "axios";
import {ElMessage, ElLoading} from "element-plus";
import router from "../../router/index.js";
//1.创建axios实例
const instance = axios.create({
    // baseURL: "http://localhost:9000/base-service",
      baseURL: "http://localhost:9001",
    // baseURL: "https://rootkim.net/rootkim-blog-api",
    timeout: 50000,
});

let loadingInstance = null;

//2.请求拦截器
instance.interceptors.request.use(
    (config) => {
        loadingInstance = ElLoading.service({fullscreen: true, background: 'rgba(0, 0, 0, 0.7)',})
        if (config.url === "/sysUser/loginByUsernameAndPassword") {
            return config;
        }
        let token = localStorage.getItem("token");
        if (token) {
            config.headers["token"] = token;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);
//3.响应拦截器
instance.interceptors.response.use(
    (response) => {
        if (loadingInstance != null) loadingInstance.close();
        if (response.data.code === 200) {
            return response.data;
        } else if (response.data.code === 401 || response.data.code === 402) {
            ElMessage.error(response.data.message);
            router.push({path: "/login"});
            return Promise.reject(response.data.message);
        } else {
            ElMessage.error(response.data.message);
            return Promise.reject(response.data.message);
        }
    },
    (err) => {
        ElMessage.error("请求失败");
        return Promise.reject(err);
    }
);
//4.导出axios实例
export default instance;