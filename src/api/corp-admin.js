import request from '@/utils/request'

export function getOrgTree() {
  return request({
    url: `/api/v1/org/tree`,
    method: 'get'
  })
}

export function getOrgPlainList(orgId) {
  return request({
    url: `/api/v1/org/subtree/plain?orgId=${orgId}`,
    method: 'get'
  })
}

export function saveOrg(data) {
  return request({
    url: `/api/v1/org/save`,
    method: 'post',
    data
  })
}

export function deleteOrg(orgId) {
  return request({
    url: `/api/v1/org/delete/${orgId}`,
    method: 'delete'
  })
}

