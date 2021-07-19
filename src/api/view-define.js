import request from '@/utils/request'

export function getViewDefineById(id) {
  return request({
    url: `/api/v1/viewDefine/${id}`,
    method: 'get'
  })
}

export function saveViewDefine(data) {
  return request({
    url: `/api/v1/viewDefine/save`,
    method: 'post',
    data
  })
}

export function deleteViewDefine(id) {
  return request({
    url: `/api/v1/viewDefine/${id}`,
    method: 'delete'
  })
}

export function selectViewDefinePage(data) {
  return request({
    url: `/api/v1/viewDefine/query`,
    method: 'post',
    data
  })
}

export function getViewByObjectCodeAndType(code, type) {
  return request({
    url: `/api/v1/viewDefine/${code}/${type}`,
    method: 'get',
  })
}

