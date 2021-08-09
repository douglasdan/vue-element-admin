import { getMdmTypeAll } from '@/lowcode/api/lowcode.js'

const state = {
  rows: [],
  data: {}
}

const mutations = {
  SET_MDM: (state, data) => {
    state.data[data.mdmCode] = data
  },
  SET_MDM_LIST: (state, data) => {
    state.rows = data
  }
}

const actions = {

  loadMdm({ commit }, key) {
    return new Promise((resolve, reject) => {
      if (state.data[key]) {
        resolve(state.data[key])
      } else {
        getMdmTypeAll().then(ret => {
          if (ret.success) {
            commit('SET_MDM_LIST', ret.data)
            ret.data.forEach(item => {
              commit('SET_MDM', item)
            })
          }
          resolve(state.data[key])
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
