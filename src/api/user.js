import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/sys/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/user/profile',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/sys/logout',
    method: 'get'
  })
}

export function getRoutes() {
  //
  let sys = window.localStorage.getItem('SYS')
  if (!sys) {
    sys = 1
  }

  return request({
    url: '/api/sys/routes?type=' + sys,
    method: 'get'
  })
}
