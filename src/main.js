import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import UUID from 'vue-uuid'
Vue.use(UUID)

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import Mdm from './components/LowCode/index'
Vue.use(Mdm)

import ViewSelect from '@/views/business-backend/ViewMgr/ViewSelect'
Vue.component('view-select', ViewSelect)

import AppSelect from '@/views/business-backend/AppMgr/AppSelect'
Vue.component('app-select', AppSelect)

import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
Vue.use(TreeSelect)

import XElement from '@/views/xview-editor/xelement'
import XButton from '@/views/xview-editor/xbutton'
import XCard from '@/views/xview-editor/xcard'
import XTable from '@/views/xview-editor/xtable'
import XObjectList from '@/views/xview-editor/xobject-list'

Vue.component('x-element', XElement)
Vue.component('x-button', XButton)
Vue.component('x-table', XTable)
Vue.component('x-card', XCard)
Vue.component('xobject-list', XObjectList)


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
