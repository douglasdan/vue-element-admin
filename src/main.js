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
import XCard from '@/views/xview-editor/xcard'
import XTable from '@/views/xview-editor/xtable'

import XObjectDefineEditor from '@/views/xview/x-object-editor'
import XFormItem from '@/views/xview/x-form-item'

import XButton from '@/views/xview/x-button'
import XRowOperator from '@/views/xview/x-row-operator'
import XObjectList from '@/views/xview/x-object-list'
import XObjectEditor from '@/views/xview/x-object-editor'

import ObjectSelect from '@/views/business-backend/ObjectMgr/ObjectSelect'

Vue.component('x-element', XElement)
Vue.component('x-button', XButton)
Vue.component('x-table', XTable)
Vue.component('x-card', XCard)

Vue.component('x-object-define-editor', XObjectDefineEditor)
Vue.component('x-form-item', XFormItem)

Vue.component('x-button', XButton)
Vue.component('x-row-operator', XRowOperator)
Vue.component('x-object-list', XObjectList)
Vue.component('x-object-editor', XObjectEditor)

Vue.component('x-object-select', ObjectSelect)

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
