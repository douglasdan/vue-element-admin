import request from '@/utils/request'

export function saveMenu(data) {
  return request({
    url: `/api/v1/menu/save`,
    method: 'post',
    data
  })
}
