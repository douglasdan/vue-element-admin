import { getOrgTree, deleteOrg, saveOrg } from '@/api/corp-admin.js'
// import { getOrgPlainList } from '@/api/corp-admin.js'
// import store from '@/store'

const state = {
  root: null,
  tree: null,
  selectOrg: null
}

const mutations = {
  SET_ROOT: (state, root) => {
    state.root = root
  },
  SET_TREE: (state, tree) => {
    console.log('SET_TREE', tree)
    state.tree = tree
  },
  SET_SELECTORG: (state, org) => {
    console.log('SET_SELECTORG', org)
    state.selectOrg = org
  }
}

function getSubTreePlainList(root, result) {
  result.push(root)
  if (root.children.length > 0) {
    root.children.forEach(item => getSubTreePlainList(item, result))
  }
  return result
}

function forceSyncOrg(commit) {
  return getOrgTree().then(ret => {
    if (ret.success) {
      commit('SET_ROOT', ret.data.root)
      commit('SET_TREE', ret.data)
    }

    if (!state.selectOrgId) {
      commit('SET_SELECTORG', ret.data.root)
    } else if (state.tree.plainDataList.filter(a => a.orgId === state.selectOrg.orgId).length === 0) {
      commit('SET_SELECTORG', ret.data.root)
    }
  })
}

const actions = {

  setSelectOrg({ commit }, data) {
    commit('SET_SELECTORG', data)
  },

  getOrgTreeRoot({ commit }) {
    return new Promise((resolve, reject) => {
      if (state.root) {
        resolve(state.root)
      } else {
        getOrgTree().then(ret => {
          if (ret.success) {
            commit('SET_ROOT', ret.data.root)
            commit('SET_TREE', ret.data)
          }

          if (!state.selectOrgId) {
            commit('SET_SELECTORG', ret.data.root)
          } else if (state.tree.plainDataList.filter(a => a.orgId === state.selectOrg.orgId).length === 0) {
            commit('SET_SELECTORG', ret.data.root)
          }

          resolve(state.root)
        })
      }
    })
  },

  getOrgTree({ commit }) {
    return new Promise((resolve, reject) => {
      if (state.tree) {
        resolve(state.tree)
      } else {
        getOrgTree().then(ret => {
          if (ret.success) {
            commit('SET_ROOT', ret.data.root)
            commit('SET_TREE', ret.data)
          }

          if (!state.selectOrgId) {
            commit('SET_SELECTORG', ret.data.root)
          } else if (state.tree.plainDataList.filter(a => a.orgId === state.selectOrg.orgId).length === 0) {
            commit('SET_SELECTORG', ret.data.root)
          }

          resolve(state.root)
        })
      }
    })
  },

  getOrgSubTreePlain({ commit }) {
    return new Promise((resolve, reject) => {
      if (state.root) {
        resolve(getSubTreePlainList(state.selectOrg, []))
      } else {
        getOrgTree().then(ret => {
          if (ret.success) {
            commit('SET_ROOT', ret.data.root)
            commit('SET_TREE', ret.data)
          }

          if (!state.selectOrgId) {
            commit('SET_SELECTORG', ret.data.root)
          } else if (state.tree.plainDataList.filter(a => a.orgId === state.selectOrg.orgId).length === 0) {
            commit('SET_SELECTORG', ret.data.root)
          }

          resolve(getSubTreePlainList(state.selectOrg, []))
        })
      }
    })
  },

  saveOrUpdateOrgAction({ commit }, data) {
    return new Promise((resolve, reject) => {
      saveOrg(data).then(ret => {
        if (ret.success) {
          forceSyncOrg(commit)
        }
        resolve(ret)
      })
    })
  },

  deleteOrgAction({ commit }, orgId) {
    return new Promise((resolve, reject) => {
      deleteOrg(orgId).then(ret => {
        if (ret.success) {
          forceSyncOrg(commit)
        }
        resolve(ret)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
