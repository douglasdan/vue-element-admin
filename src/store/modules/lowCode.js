import { selectViewDefinePage } from '@/api/view-define.js'

import { getObjectDefineById, deleteObjectDefine, saveObjectDefine, selectObjectDefinePage } from '@/api/object-define'
import { selectObjectFieldDefinePage, deleteObjectFieldDefine, saveObjectFieldDefine } from '@/api/object-field-define'
import { getViewDefineById } from '@/api/object-define'

const state = {
  apps: [],
  views: [],
  objects: {

  },
  objectCodeMap: {

  }
}

const mutations = {
  SET_APPS: (state, data) => {
    state.apps = data
  },
  SET_VIEWS: (state, data) => {
    state.views = data
  },
  SET_OBJECT_DEFINE: (state, { oid, data }) => {
    state.objects[oid] = data
    state.objectCodeMap[data.fieldCode] = data
  },
  UPDATE_OBJECT_DEFINE: (state, oid) => {
    if (state.objects[oid]) {
      delete state.objectCodeMap[state.objects[oid].fieldCode]
    }
    delete state.objects[oid]
  },

  SET_VIEW_DEFINE: (state, { vid, view }) => {
    state.views['' + vid] = view
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
        selectObjectDefinePage({
          conditions: [
            { field: 'object_code', op: 'eq', values: [code] }
          ]
        }).then(ret => {
          if (ret.success && ret.data.rows.length > 0) {
            const oid = ret.data.rows[0].id
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
            resolve(null)
          }
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

  getViewDefine({ commit }, vid) {
    console.log(new Date(), 'lowCode/getViewDefine ' + vid)

    return new Promise((resolve, reject) => {
      if (!state.views['' + vid]) {
        getViewDefineById(oid).then(ret => {
          if (ret.success) {
            commit('SET_VIEW_DEFINE', {
              oid: '' + vid,
              data: ret.data
            })
          }
          resolve(ret.data)
        })
      } else {
        resolve(state.views['' + vid])
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
