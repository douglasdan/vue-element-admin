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

import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
Vue.use(TreeSelect)

/** **********lowcode components ************/
import lcViewEditor from '@/lowcode/view/lc-view-editor'
Vue.component('lc-view-editor', lcViewEditor)

import lcView from '@/lowcode/view/lc-view'
Vue.component('lc-view', lcView)

import lcViewListEditor from '@/lowcode/view/view-editor/lc-view-list-editor'
Vue.component('lc-view-list-editor', lcViewListEditor)

import lcViewCreateEditor from '@/lowcode/view/view-editor/lc-view-create-editor'
Vue.component('lc-view-create-editor', lcViewCreateEditor)

import lcViewEditEditor from '@/lowcode/view/view-editor/lc-view-edit-editor'
Vue.component('lc-view-edit-editor', lcViewEditEditor)

import lcViewList from '@/lowcode/view/template/lc-view-list'
Vue.component('lc-view-list', lcViewList)

import lcViewCreate from '@/lowcode/view/template/lc-view-create'
Vue.component('lc-view-create', lcViewCreate)

import lcViewEdit from '@/lowcode/view/template/lc-view-edit'
Vue.component('lc-view-edit', lcViewEdit)

import lcAppSelect from '@/lowcode/view/components/lc-app-select'
Vue.component('lc-app-select', lcAppSelect)

import lcCondition from '@/lowcode/view/components/lc-condition'
Vue.component('lc-condition', lcCondition)

import lcFieldSelect from '@/lowcode/view/components/lc-field-select'
Vue.component('lc-field-select', lcFieldSelect)

import lcFormItem from '@/lowcode/view/components/lc-form-item'
Vue.component('lc-form-item', lcFormItem)

import lcFieldInput from '@/lowcode/view/components/lc-field-input'
Vue.component('lc-field-input', lcFieldInput)

import lcButton from '@/lowcode/view/components/lc-button'
Vue.component('lc-button', lcButton)

import lcObjectSelect from '@/lowcode/view/components/lc-object-select'
Vue.component('lc-object-select', lcObjectSelect)

import lcObjectDataSelect from '@/lowcode/view/components/lc-object-data-select'
Vue.component('lc-object-data-select', lcObjectDataSelect)

import lcShowFieldsEditor from '@/lowcode/view/view-editor/lc-show-fields-editor'
Vue.component('lc-show-fields-editor', lcShowFieldsEditor)

import lcViewBtnEditor from '@/lowcode/view/view-editor/lc-view-btn-editor'
Vue.component('lc-view-btn-editor', lcViewBtnEditor)

import lcViewConditionsEditor from '@/lowcode/view/view-editor/lc-view-conditions-editor'
Vue.component('lc-view-conditions-editor', lcViewConditionsEditor)

import lcMdmCode from '@/lowcode/view/components/lc-mdm-code'
Vue.component('lc-mdm-code', lcMdmCode)

import lcMdmSelect from '@/lowcode/view/components/lc-mdm-select'
Vue.component('lc-mdm-select', lcMdmSelect)

import lcBool from '@/lowcode/view/components/lc-bool'
Vue.component('lc-bool', lcBool)










import Mdm from './components/LowCode/index'
Vue.use(Mdm)

import ViewSelect from '@/views/business-backend/ViewMgr/ViewSelect'
Vue.component('view-select', ViewSelect)

import AppSelect from '@/views/business-backend/AppMgr/AppSelect'
Vue.component('app-select', AppSelect)

import XObjectDefineEditor from '@/views/xview/x-object-editor'
import XObjectEditor from '@/views/xview/x-object-editor'
Vue.component('x-object-define-editor', XObjectDefineEditor)
Vue.component('x-object-editor', XObjectEditor)

// 主数据选择器
import MdmList from '@/views/business-backend/MdmDataMgr/MdmList'
Vue.component('mdm-list', MdmList)

// 对象选择器
import ObjectSelect from '@/views/business-backend/ObjectMgr/ObjectSelect'
Vue.component('x-object-select', ObjectSelect)

import ObjectFieldSelect from '@/views/business-backend/ObjectMgr/ObjectFieldSelect'
Vue.component('x-object-field-select', ObjectFieldSelect)

import XObjectFieldControl from '@/views/xview/components/x-object-field-control'
Vue.component('x-object-field-control', XObjectFieldControl)

import XObjectFieldQuery from '@/views/xview/components/x-object-field-query'
Vue.component('x-object-field-query', XObjectFieldQuery)

import xObjectCondition from '@/views/xview/components/x-object-condition'
Vue.component('x-object-condition', xObjectCondition)

import xObjectDataSelect from '@/views/xview/components/x-object-data-select'
Vue.component('x-object-data-select', xObjectDataSelect)

// 字段输入
import xFormItem from '@/views/xview/components/x-form-item'
Vue.component('x-form-item', xFormItem)

import xObjectFilter from '@/views/xview/x-object-filter'
Vue.component('x-object-filter', xObjectFilter)

// 对象列表展示
import XObjectListView from '@/views/xview/components/x-object-list-view'
Vue.component('x-object-list-view', XObjectListView)

// 对象编辑展示
import XObjectEditView from '@/views/xview/components/x-object-edit-view'
Vue.component('x-object-edit-view', XObjectEditView)

// 对象展示视图
import XObjectViewView from '@/views/xview/components/x-object-view-view'
Vue.component('x-object-view-view', XObjectViewView)

// 视图，数据行功能按钮
import XRowOperator from '@/views/xview/components/x-row-operator'
Vue.component('x-row-operator', XRowOperator)

// 显示页面
import ShowView from '@/views/business-backend/ViewMgr/ShowView'
Vue.component('show-view', ShowView)

import XElement from '@/views/xview-editor/xelement'
import XCard from '@/views/xview-editor/xcard'
import XTable from '@/views/xview-editor/xtable'
import XButton from '@/views/xview/x-button'

Vue.component('x-element', XElement)
Vue.component('x-button', XButton)
Vue.component('x-table', XTable)
Vue.component('x-card', XCard)

Vue.component('x-button', XButton)

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
