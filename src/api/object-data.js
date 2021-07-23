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
    url: `/api/v1/object/${oid}/delete/${id}`,
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

export function selectTreeRootPage(oid, data) {
  return request({
    url: `/api/v1/object/${oid}/tree/roots`,
    method: 'post',
    data
  })
}

export function getTree(oid, id) {
  return request({
    url: `/api/v1/object/${oid}/tree/${id}`,
    method: 'get',
  })
}

export function callObjectAction(oid, id, cmd, data) {
  return request({
    url: `/api/v1/object/${oid}/${id}/action?cmd=${cmd}`,
    method: 'post',
    data
  })
}
