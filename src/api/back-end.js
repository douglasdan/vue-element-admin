import request from '@/utils/request'

export function saveMenu(data) {
  return request({
    url: `/api/v1/menu/save`,
    method: 'post',
    data
  })
}

export function deleteMenuById(id) {
  return request({
    url: `/api/v1/menu/delete/${id}`,
    method: 'delete',
  })
}
