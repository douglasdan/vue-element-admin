import { selectViewDefinePage } from '@/api/view-define.js'

import { getViewByObjectCodeAndViewCode, getObjectDefineById, getObjectDefineByCode, selectObjectDataPage } from '@/lowcode/api/lowcode'
import { LowcodeConst } from '@/lowcode/api/lowcode'

const state = {
  apps: [],
  views: [],
  objects: {

  },
  objectCodeMap: {

  },
  mdmItems: {

  },
  keywords: [],
  defaultFields: ['id', 'create_by', 'create_user', 'create_time', 'update_by', 'update_user', 'update_time', 'tenant_id', 'tenant_code', 'company_id', 'company_code', 'depart_id', 'depart_code']
}

const mutations = {
  SET_APPS: (state, data) => {
    state.apps = data
  },
  SET_VIEWS: (state, data) => {
    state.views = data
  },
  CACHE_VIEW: (state, view) => {
    state.view.push(view)
  },

  SET_OBJECT_DEFINE: (state, { oid, data }) => {
    state.objects[oid] = data
    state.objectCodeMap[data.objectCode] = data
  },
  UPDATE_OBJECT_DEFINE: (state, oid) => {
    if (state.objects[oid]) {
      delete state.objectCodeMap[state.objects[oid].fieldCode]
    }
    delete state.objects[oid]
  },
  SET_VIEW_DEFINE: (state, { vid, view }) => {
    state.views['' + vid] = view
  },
  SET_MDM_ITEMS: (state, {code, data}) => {
    state.mdmItems[code] = data
  }
}

const actions = {

  getApps({ commit }, id) {
    return new Promise((resolve, reject) => {
      if (state.apps.length === 0) {
        selectAppPage().then(ret => {
          if (ret.success) {
            commit('SET_APPS', ret.data.rows)
          }

          let name = ''
          state.apps.forEach((item) => {
            if (item.appId === id) {
              name = item.appName
            }
          })
          resolve(name)
        })
      } else {
        let name = ''
        state.apps.forEach((item) => {
          if (item.appId === id) {
            name = item.appName
          }
        })
        resolve(name)
      }
    })
  },

  getViews({ commit }) {
    return new Promise((resolve, reject) => {
      if (state.apps.length === 0) {
        selectViewDefinePage({}).then(ret => {
          if (ret.success) {
            commit('SET_VIEWS', ret.data.rows)
          }
          resolve(ret.data.rows)
        })
      } else {
        resolve(state.views)
      }
    })
  },

  getObjectDefine({ commit }, oid) {
    console.log(new Date(), 'lowCode/getObjectDefine ' + oid)

    return new Promise((resolve, reject) => {
      if (!state.objects['' + oid]) {
        // console.log(`state.objects[''+${oid}]`, 'not exists')
        getObjectDefineById(oid).then(ret => {
          if (ret.success) {
            commit('SET_OBJECT_DEFINE', {
              oid: '' + oid,
              data: ret.data
            })
          }
          resolve(ret.data)
        })
      } else {
        resolve(state.objects['' + oid])
      }
    })
  },

  getObjectDefineByCode({ commit }, code) {
    console.log(new Date(), 'lowCode/getObjectDefineByCode ' + code)

    return new Promise((resolve, reject) => {
      if (!state.objectCodeMap['' + code]) {
        getObjectDefineByCode(code).then(ret => {
          if (ret.success) {
            commit('SET_OBJECT_DEFINE', {
              oid: ret.data.id,
              data: ret.data
            })
          }
          resolve(ret.data)
        })
      } else {
        resolve(state.objectCodeMap['' + code])
      }
    })
  },

  updateObjectDefine({ commit }, oid) {
    return new Promise((resolve, reject) => {
      commit('UPDATE_OBJECT_DEFINE', oid)
      resolve(true)
    })
  },

  getMdmItems({commit}, mdmCode) {
    return new Promise((resolve, reject) => {
      if (state.mdmItems[mdmCode]) {
        resolve(state.mdmItems[mdmCode])
      } else {
        selectObjectDataPage(LowcodeConst().tables.MDM_ITEM, {
          conditions: [{
            fieldCode: 'mdm_code', op:'eq', values:[mdmCode]
          }]
        }).then(ret => {
          if (ret.success && ret.data) {
            commit('SET_MDM_ITEMS', {
              code: mdmCode,
              data: ret.data.rows
            })
            resolve(ret.data.rows)
          } else {
            resolve([])
          }
        })
      }
    })
  },

  getViewDefine({ commit }, { ocode, vcode }) {
    console.log(new Date(), 'lowCode/getViewDefine ' + ocode + ' ' + vcode)

    return new Promise((resolve, reject) => {
      if (state.views.length > 0) {
        let finded = false
        state.view.forEach((v) => {
          if (v.objectCode == ocode && v.viewCode == vcode) {
            finded = true
            resolve(v)
          }
        })
      }

      if (!finded) {
        getViewByObjectCodeAndViewCode(ocode, vcode).then(ret => {
          if (ret.success) {
            commit('SET_VIEW_DEFINE', {
              oid: '' + vid,
              data: ret.data
            })
          }
          resolve(ret.data)
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
