import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/globel.css'
import './assets/fonts/iconfont.css'



Vue.config.productionTip = false

// 配置axios请求全局配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 设置拦截器
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
