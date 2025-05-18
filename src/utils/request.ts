import axios from 'axios'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'
//创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 60000
})
//请求拦截器
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // // 在请求头中携带 token
    // const token = Cookies.get('auth_token');
    // if (token) {
    //   config.headers.Authorization = token;
    // }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  })
//响应拦截器
request.interceptors.response.use((response) => {


  return response.data
})
export default request
