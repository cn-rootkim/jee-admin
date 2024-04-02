import axios from "axios";
import { ElMessage,ElLoading } from "element-plus";
//1.创建axios实例
const instance = axios.create({
  baseURL: "http://localhost:8080/jee-monomer",
  timeout: 50000,
});

let loadingInstance = null;

//2.请求拦截器
instance.interceptors.request.use(
    (config) => {
        loadingInstance = ElLoading.service({ fullscreen: true,background: 'rgba(0, 0, 0, 0.7)', })
    if (config.url === "/sysUser/login") {
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
      if(loadingInstance!=null) loadingInstance.close();
    if (response.data.code === 200) {
        return response.data;
    } else if (response.data.code === 401 || response.data.code === 402) {
        ElMessage.error(response.data.message);
        window.location.href = "/login";
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