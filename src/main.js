// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import mixin from "./mixins/mixins";
import { VueAxios } from './utils/request'
import { toast } from '@/utils/toast'

import themePluginConfig from '../config/themePluginConfig'
import global from '../src/utils/global'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'
Vue.prototype.$isDev = process.env.NODE_ENV === "development"

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style

Vue.config.productionTip = false

Vue.prototype.toast = toast

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.use(global)
Vue.mixin(mixin);

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  i18n,
  router,
  store,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
