import request from '@/utils/request'

export function getObjectFieldDefineById(id) {
  return request({
    url: `/api/v1/objectFieldDefine/${id}`,
    method: 'get'
  })
}

export function saveObjectFieldDefine(data) {
  return request({
    url: `/api/v1/objectFieldDefine/save`,
    method: 'post',
    data
  })
}

export function selectObjectFieldDefinePage(data) {
  return request({
    url: `/api/v1/objectFieldDefine/query`,
    method: 'post',
    data
  })
}

