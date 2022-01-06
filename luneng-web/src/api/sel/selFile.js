import request from '@/utils/request'

// 查询申报信息列表
export function fileList(query) {
  return request({
    url: '/sel/file/list',
    method: 'get',
    params: query
  })
}

export function deleteFile(query) {
  return request({
    url: '/sel/file/' + query,
    method: 'delete'
  })
}
