import request from '@/utils/request'

//*********** 应用 ***********/

export function getAppByCode(code) {
  return request({
    url: `/api/v1/app/${code}`,
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

//*********** 主数据 ***********/

//CRUD通过标准的对象API来处理

// 获取mdm_type的所有最新的数据
export function getMdmTypeAll(code) {
  if (!code) {
    code = ''
  }
  return request({
    url: `/api/v1/mdm/type/all`,
    method: 'get'
  })
}

//*********** 对象定义 ***********/

export function saveObjectDefine(data) {
  return request({
    url: `/api/v1/objectDefine/save`,
    method: 'post',
    data
  })
}

export function deleteObjectDefine(id) {
  return request({
    url: `/api/v1/objectDefine/delete/${id}`,
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

export function syncObjectDefineToDB(code) {
  return request({
    url: `/api/v1/objectDefine/${code}/syncdb`,
    method: 'get'
  })
}

export function cloneObjectDefine(code, data) {
  return request({
    url: `/api/v1/objectDefine/${code}/clone`,
    method: 'post',
    data
  })
}

//*********** 对象字段定义 ***********/

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

//*********** 数据操作 ***********/

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

export function selectTreeRootPage(code, data) {
  return request({
    url: `/api/v1/object/${code}/tree/roots`,
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
