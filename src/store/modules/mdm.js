import { getMdmTypeAll } from '@/api/mdm.js'

// mdm_type=1 bool
// mdm_type=2 list
// mdm_type=3 tree

const state = {
  data: {}
}

const mutations = {
  SET_MDM: (state, data) => {
    state.data[data.mdmCode] = data
  }
}

const actions = {

  getMdmData({ commit }, key) {
    return new Promise((resolve, reject) => {
      if (state.data[key]) {
        resolve(state.data[key])
      } else {
        getMdmTypeAll().then(ret => {
          console.log('load mdm success: ' + JSON.stringify(ret))
          if (ret.success) {
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
