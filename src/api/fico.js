import request from '@/utils/request'

export function selectCsSharingMethodPage(data) {
  return request({
    url: '/api/v1/csSharingMethod/query',
    method: 'post',
    data
  })
}

export function saveCsSharingMethod(data) {
  return request({
    url: '/api/v1/csSharingMethod/save',
    method: 'post',
    data
  })
}

export function deleteCsSharingMethod(id) {
  return request({
    url: `/api/v1/csSharingMethod/delete/${id}`,
    method: 'delete'
  })
}

export function executeStrategy(id, year, period) {
  return request({
    url: `/api/v1/costsharing/execute?id=${id}&year=${year}&period=${period}`,
    method: 'get'
  })
}

export function getShareLine(id) {
  return request({
    url: `/api/v1/costsharing/line?id=${id}`,
    method: 'get'
  })
}

export function getShareChildren(id) {
  return request({
    url: `/api/v1/costsharing/children?id=${id}`,
    method: 'get'
  })
}
