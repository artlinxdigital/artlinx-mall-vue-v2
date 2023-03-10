import axios from 'axios';
import { EventBus } from '@/utils/event-bus';

// 请求超时时间
axios.defaults.timeout = 1000 * 60;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 设置公共url
// axios.defaults.baseURL = 'https://getman.cn/mock'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // console.log(config);
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  console.error('☕️:', error);
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log('iiiii', response);
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  if(error.message.includes('timeout')){
    EventBus.$emit('onNetErr');
    return Promise.reject(error);
  }
  if (!navigator.onLine) {
    EventBus.$emit('onNetErr');
    return Promise.reject(error);
  }
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default axios;
