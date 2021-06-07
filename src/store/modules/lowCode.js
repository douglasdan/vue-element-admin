import { selectViewDefinePage } from '@/api/view-define.js'

const state = {
  apps: [],
  objects: [],
  views: []
}

const mutations = {
  SET_APPS: (state, data) => {
    state.apps = data
  },
  SET_VIEWS: (state, data) => {
    state.views = data
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
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
