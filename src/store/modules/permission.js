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

  if (menu.virtual) {
    return generateRouteMetaByMenu(menu.children, path)
  } else if (Array.isArray(menu)) {
    return Object.values(menu).map(item => {
      return generateRouteMetaByMenu(item, path)
    })
  } else {
    const route = {
      fullPath: path + '/' + menu.menuPath,
      path: path.indexOf('/') === -1 ? '/' + menu.menuPath : menu.menuPath,
      children: generateRouteMetaByMenu(menu.children, path + '/' + menu.menuPath),
      name: menu.menuName,
      meta: {
        title: menu.menuName
      }
    }

    if (route.children.length > 0) {
      route.redirect = route.fullPath + '/' + route.children[0].path
      route.component = () => import('@/layout/index.vue')
    } else {
      //
      route.component = routesMap[route.fullPath]
    }
    return route
  }
}

const state = {
  routes: [],
  asyncRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.asyncRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let accessedRoutes = state.asyncRoutes

      if (accessedRoutes.length === 0) {
        getRoutes().then((response) => {
          if (response.success) {
            accessedRoutes = generateRouteMetaByMenu(response.data.menuTree.root, '')

            if (accessedRoutes.length === 0) {
              reject('您没有被授予任何角色权限，请联系管理员')
            } else {
              window.localStorage.setItem('ROUTES', JSON.stringify(accessedRoutes))
              window.localStorage.setItem('RedirectTo.default', response.data.redirectTo)

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
