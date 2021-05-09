import request from '@/utils/request'

export function getMdmDataById(id) {
  return request({
    url: `/api/v1/mdm/${id}`,
    method: 'get'
  })
}

// 获取key的所有版本的数据
export function getMdmLastVer(code) {
  return request({
    url: `/api/v1/mdm/last?code=${code}`,
    method: 'get'
  })
}

// 获取mdm_type的所有最新的数据
export function getMdmTypeAll(type) {
  if (!type) {
    type = ''
  }
  return request({
    url: `/api/v1/mdm/type/all?type=${type}`,
    method: 'get'
  })
}

