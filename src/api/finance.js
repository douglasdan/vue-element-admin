import request from '@/utils/request'

export function selectFiBookSetPage(data) {
  return request({
    url: '/api/v1/fiBookSet/query',
    method: 'post',
    data
  })
}

export function saveFiBookSet(data) {
  return request({
    url: '/api/v1/fiBookSet/save',
    method: 'post',
    data
  })
}

export function deleteFiBookSet(id) {
  return request({
    url: `/api/v1/fiBookSet/delete/${id}`,
    method: 'delete'
  })
}


export function selectFiSegmentDefinePage(data) {
  return request({
    url: '/api/v1/fiSegmentDefine/query',
    method: 'post',
    data
  })
}

export function saveFiSegmentDefine(data) {
  return request({
    url: '/api/v1/fiSegmentDefine/save',
    method: 'post',
    data
  })
}

export function deleteFiSegmentDefine(id) {
  return request({
    url: `/api/v1/fiSegmentDefine/delete/${id}`,
    method: 'delete'
  })
}


export function selectFiVoucherPage(data) {
  return request({
    url: '/api/v1/fiVoucher/query',
    method: 'post',
    data
  })
}

export function saveFiVoucher(data) {
  return request({
    url: '/api/v1/fiVoucher/save',
    method: 'post',
    data
  })
}

export function deleteFiVoucher(id) {
  return request({
    url: `/api/v1/fiVoucher/delete/${id}`,
    method: 'delete'
  })
}

