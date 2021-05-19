import request from '@/utils/request'

export function getObjectDefineById(id) {
  return request({
    url: `/api/v1/objectDefine/${id}`,
    method: 'get'
  })
}

export function saveObjectDefine(data) {
  return request({
    url: `/api/v1/objectDefine/save`,
    method: 'post',
    data
  })
}

export function deleteObjectDefine(id) {
  return request({
    url: `/api/v1/objectDefine/${id}`,
    method: 'delete',
  })
}

export function selectObjectDefinePage(data) {
  return request({
    url: `/api/v1/objectDefine/query`,
    method: 'post',
    data
  })
}

