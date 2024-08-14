import axios from "axios";
import store from "@/store";
import storage from "store";
import { Notification } from "ant-design-vue";
import { VueAxios } from "./axios";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import router from '@/router'
const NOTIFICATION_KEY = "request_hint";

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: "/api",
  timeout: 10000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
  if (
    error.request &&
    error.request.responseType &&
    error.request.responseType == "blob"
  ) {
    let reader = new FileReader();
    reader.onload = (e) => {
      // let errData = JSON.parse(e.target.result);
    };
    reader.readAsText(error.response.data);
  }
  return Promise.resolve(error);
};

// 请求拦截
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN);
  if (token) {
    config.headers = {
      // "Content-Type": "application/json",
      authorization: "Bearer " + token,
      lang: store.getters.lang,
    };
  } else {
    config.headers = {
      // "Content-Type": "application/json",
      lang: store.getters.lang,
    };
  }
  return config;
}, errorHandler);

// 响应拦截
request.interceptors.response.use((response) => {
  if (response.data.code === 0) {
    return Promise.resolve(response.data);
  } else if (response.data.code === 400 || response.data.code === 401 || response.data.code === 200001 || response.data.code === 200002) {
    // 登录失效
    store.dispatch("Logout", true).then(() => {
      router.replace({ path: "/user/login" }).catch(err=>{
      });
    });
    Notification.error({
      key: NOTIFICATION_KEY,
      message: "登录失效,请重新登录",
    });
  } else if (response.data.msg) {
    Notification.error({
      key: NOTIFICATION_KEY,
      message: response.data.msg,
    });
    return response.data;
  }
  return response.data;
}, errorHandler);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request);
  },
};

export default request;

export { installer as VueAxios, request as axios };
