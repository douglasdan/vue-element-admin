import { constantRoutes } from '@/router'
// import { MessageBox, Message } from 'element-ui'
import { getRoutes } from '@/api/user'
import { routesMap } from '@/router/views'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

function generateRouteMetaByMenu(menu, path) {
  if (!menu) {
    return []
  }

  if (menu.children && menu.children.lenght > 1) {
    menu.children = menu.children.sort(sortMenu)
  }

  if (menu.virtual) {
    return generateRouteMetaByMenu(menu.children, path)
  } else if (Array.isArray(menu)) {
    return Object.values(menu.sort(sortMenu)).map(item => {
      return generateRouteMetaByMenu(item, path)
    })
  } else {
    const route = {
      fullPath: path + '/' + menu.menuPath,
      path: path.indexOf('/') === -1 ? '/' + menu.menuPath : menu.menuPath,
      children: generateRouteMetaByMenu(menu.children, path + '/' + menu.menuPath),
      name: menu.menuName,
      meta: {
        title: menu.menuName,
        menuId: menu.menuId
      }
    }

    if (route.children.length > 0) {
      route.redirect = route.fullPath + '/' + route.children[0].path

      if (menu.depth === 1) {
        route.component = () => import('@/layout/index.vue')
      } else {
        route.component = () => import('@/views/index.vue')
      }
    } else {
      //
      route.component = routesMap[route.fullPath]
    }
    return route
  }
}

function sortMenu(a, b) {
  if (!a.menuOrder) {
    a.menuOrder = 0
  }
  if (!b.menuOrder) {
    b.menuOrder = 0
  }
  return a.menuOrder - b.menuOrder
}

function generateRouteMetaByMenu2(menu) {
  if (!menu) {
    return []
  }

  if (menu.virtual) {
    return generateRouteMetaByMenu2(menu.children)
  } else if (Array.isArray(menu)) {
    return Object.values(menu.sort(sortMenu)).map(item => {
      return generateRouteMetaByMenu2(item)
    })
  } else {
    const route = {
      path: menu.menuPath ? menu.menuPath : '/view' + menu.menuId,
      children: generateRouteMetaByMenu2(menu.children),
      name: menu.menuName,
      meta: {
        title: menu.menuName
      }
    }

    if (route.children.length > 0) {
      route.redirect = route.children[0].path
      console.log('redirect from ', route.path, 'to', route.redirect)
      if (menu.depth === 1) {
        route.component = () => import('@/layout/index.vue')
      } else {
        route.component = () => import('@/views/index.vue')
      }
    } else {
      if (menu.menuPath) {
        route.component = routesMap[route.path]
      } else {
        route.component = () => import('@/views/business-backend/ViewMgr/ShowView')
      }
    }

    console.log('generate', route.meta.title, route.path)
    return route
  }
}

function SYS() {
  if (window.localStorage.getItem('SYS')) {
    return parseInt(window.localStorage.getItem('SYS'))
  }
  window.localStorage.setItem('SYS', 1)
  return 1
}

const state = {
  routes: [],
  asyncRoutes: [],

  menuDefines: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.asyncRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENU_DEFINES: (state, defines) => {
    state.menuDefines = defines
  }
}

const actions = {
  clearRoutes({ commit }) {
    commit('SET_ROUTES', [])
    commit('SET_MENU_DEFINES', [])
  },

  getMenuDefine({ commit }, id) {
    return new Promise((resolve, reject) => {
      let ret = null
      state.menuDefines.forEach((item) => {
        if (item.menuId === id) {
          ret = item
        }
      })
      resolve(ret)
    })
  },

  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let accessedRoutes = state.asyncRoutes

      if (accessedRoutes.length === 0) {
        getRoutes(SYS()).then((response) => {
          if (response.success) {
            if (SYS() != 1) {
              accessedRoutes = [].concat(generateRouteMetaByMenu2(response.data.menuTree.root))
              commit('SET_MENU_DEFINES', response.data.menuTree.plainNodeList)

              console.log('accessedRoutes ', JSON.stringify(accessedRoutes))
              window.localStorage.setItem('RedirectTo.default', accessedRoutes[0].path)
            } else {
              accessedRoutes = [].concat(generateRouteMetaByMenu(response.data.menuTree.root, ''))
              window.localStorage.setItem('RedirectTo.default', response.data.redirectTo)
            }

            if (accessedRoutes.length === 0) {
              reject('您没有被授予任何角色权限，请联系管理员')
            } else {
              if (SYS() === 1) {
                accessedRoutes.push({
                  path: '/profile',
                  component: () => import('@/layout/index.vue'),
                  children: [
                    {
                      path: 'index',
                      component: () => import('@/views/user-profile.vue'),
                      name: '个人中心',
                      meta: { title: '个人中心', icon: 'user' }
                    }
                  ]
                })
              }

              accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })

              commit('SET_ROUTES', accessedRoutes)
              resolve(accessedRoutes)
            }
          }
        })
      } else {
        resolve(accessedRoutes)
      }

      // 使用LocalStorage存储
      // if (!window.localStorage.getItem("ROUTES")) {
      //   reject("您没有被授予任何角色权限，请联系管理员")
      //   // Message.error("")
      // }
      // else {
      //   accessedRoutes = JSON.parse(window.localStorage.getItem("ROUTES"))
      //   accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      // }

      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
