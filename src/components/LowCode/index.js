import MdmData from './MdmData'
import MdmSelect from './MdmSelect'
import MdmTree from './MdmTree'
import OrgTreeSelect from './OrgTreeSelect'

const LoadingMdm = {
  // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
  install: function(Vue) {
    Vue.component('mdm-data', MdmData)
    Vue.component('mdm-select', MdmSelect)
    Vue.component('mdm-tree', MdmTree)
    Vue.component('org-tree-select', OrgTreeSelect)
  }
}
// 导出
export default LoadingMdm
