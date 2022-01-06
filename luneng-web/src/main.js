import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/sailing.scss' // sailing css

import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import {getDicts} from "@/api/system/dict/data";
import {getConfigKey} from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  download,
  handleTree,
  typeFormat,
  getDiffDay,
  createCode,
  closeView
} from "@/utils/sailing";
import Pagination from "@/components/Pagination";
import Upload from "@/components/Upload";
import Address from '@/components/Address';
import crudOperation from '@/components/Crud/CRUD.operation';
import AInput from '@/components/AInput';
import MInput from '@/components/MInput';
import PreviewPdf from '@/components/PreviewPdf';
import {InfiniteScroll} from 'element-ui';
import {exportPdf, pdfToImg} from "@/utils/pdf";

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.createCode = createCode
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.typeFormat = typeFormat
Vue.prototype.getDiffDay = getDiffDay
Vue.prototype.closeView = closeView
Vue.prototype.exportPdf = exportPdf


Vue.prototype.msgSuccess = function (msg) {
  this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: "success", customClass: 'message-box'});
}

Vue.prototype.msgError = function (msg) {
  this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: "error", customClass: 'message-box'});
}

Vue.prototype.msgInfo = function (msg) {
  this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: "info", customClass: 'message-box'});
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('Upload', Upload)
Vue.component('Address', Address)
Vue.component('crudOperation', crudOperation)
Vue.component('AInput', AInput)
Vue.component('MInput', MInput)
Vue.component('PreviewPdf', PreviewPdf)

Vue.use(permission)
Vue.use(InfiniteScroll)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
