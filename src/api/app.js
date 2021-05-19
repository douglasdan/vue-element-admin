import request from '@/utils/request'

export function getAppById(id) {
  return request({
    url: `/api/v1/app/${id}`,
    method: 'get'
  })
}

export function saveApp(data) {
  return request({
    url: `/api/v1/app/save`,
    method: 'post',
    data
  })
}

export function selectAppPage(data) {
  return request({
    url: `/api/v1/app/query`,
    method: 'post',
    data
  })
}

