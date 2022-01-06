import request from '@/utils/request'

// 查询日志列表
export function listOperLog(query) {
  return request({
    url: '/project/operLog/list',
    method: 'get',
    params: query
  })
}
