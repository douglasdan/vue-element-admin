import request from '@/utils/request'

export function getObjectDataById(oid, id) {
  return request({
    url: `/api/v1/object/${oid}/${id}`,
    method: 'get'
  })
}

export function saveObjectData(oid, data) {
  return request({
    url: `/api/v1/object/${oid}/save`,
    method: 'post',
    data
  })
}

export function deleteObjectData(oid, id) {
  return request({
    url: `/api/v1/object/${oid}/${id}`,
    method: 'delete'
  })
}

export function selectObjectDataPage(oid, data) {
  return request({
    url: `/api/v1/object/${oid}/query`,
    method: 'post',
    data
  })
}

