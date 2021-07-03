import { selectViewDefinePage } from '@/api/view-define.js'

import { getObjectDefineById, deleteObjectDefine, saveObjectDefine } from '@/api/object-define'
import { selectObjectFieldDefinePage, deleteObjectFieldDefine, saveObjectFieldDefine } from '@/api/object-field-define'

const state = {
  apps: [],
  views: [],

  objects: {

  },

}

const mutations = {
  SET_APPS: (state, data) => {
    state.apps = data
  },
  SET_VIEWS: (state, data) => {
    state.views = data
  },
  SET_OBJECT_DEFINE: (state, {oid, data}) => {
    state.objects[oid] = data
  },
  UPDATE_OBJECT_DEFINE: (state, oid) => {
    delete state.objects[oid]
  },
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

    console.log(new Date(),'lowCode/getObjectDefine '+oid)

    return new Promise((resolve, reject) => {
      if (!state.objects[''+oid]) {
        // console.log(`state.objects[''+${oid}]`, 'not exists')
        getObjectDefineById(oid).then(ret => {
          if (ret.success) {
            commit('SET_OBJECT_DEFINE', {
              oid: ''+oid,
              data: ret.data
            })
          }
          resolve(ret.data)
        })
      }
      else {
        resolve(state.objects[''+oid])
      }
    })
  },

  updateObjectDefineupdateObjectDefine({ commit }, oid) {
    return new Promise((resolve, reject) => {
      commit('UPDATE_OBJECT_DEFINE', oid)
      resolve(true)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
