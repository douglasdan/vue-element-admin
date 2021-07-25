import { selectObjectDataPage } from '@/api/object-data'
import store from '@/store'

const state = {
  conditions:[],
  origin:[],
  sender:[],
  receiver:[],

  factors:[]
}

const mutations = {
  SET_DATA: (state, data) => {
    state.conditions = data
    state.origin = data.filter(a => a.origin == '1')
    state.sender = data.filter(a => a.sender == '1')
    state.receiver = data.filter(a => a.receiver == '1')
  },

  SET_FACTORS: (state, data) => {
    state.factors = data
  },
}

const actions = {

  getSendConditions({ commit }, type) {
    return new Promise((resolve, reject) => {

      if (state.conditions.length === 0) {

        store.dispatch('lowCode/getObjectDefineByCode', 'CS_FORCAL_CONFIG').then(ret => {
          if (ret) {
            selectObjectDataPage(ret.id, {}).then(ret2 => {

              let temp = ret2.data.rows.sort((a,b) => a.sortNo-b.sortNo).map((item) => {
                return {
                  id: item.id,
                  objectCode: item.objectCode,
                  fieldName: item.fieldName,
                  field: item.field,
                  joinField: item.field,
                  dataCode: item.dataCode,
                  dataField: item.dataCode,
                  op: 'eq',
                  values: [],
                  origin: item.origin,
                  sender: item.sender,
                  receiver: item.receiver,
                }
              })

              commit('SET_DATA', temp)

              resolve(JSON.parse(JSON.stringify(state[type])))
            })
          }
        })
      } else {
        resolve(JSON.parse(JSON.stringify(state[type])))
      }
    })
  },

  getFactors({ commit }) {
    return new Promise((resolve, reject) => {

      if (state.factors.length === 0) {

        store.dispatch('lowCode/getObjectDefineByCode', 'CS_FORCAL_FACTOR').then(ret => {
          if (ret) {
            selectObjectDataPage(ret.id, {}).then(ret2 => {

              let temp = ret2.data.rows.map((item) => {
                return {
                  factorCode: item.factorCode,
                  factorName: item.factorName
                }
              })

              commit('SET_FACTORS', temp)

              resolve(state.factors)
            })
          }
        })
      } else {
        resolve(state.factors)
      }
    })
  },


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
