import request from '@/utils/request'

export function selectRolePage(data) {
  return request({
    url: '/api/v1/role/query',
    method: 'post',
    data
  })
}

export function saveRole(data) {
  return request({
    url: '/api/v1/role/save',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/api/v1/role/delete/${id}',
    method: 'delete'
  })
}
