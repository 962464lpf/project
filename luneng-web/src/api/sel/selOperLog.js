import request from '@/utils/request'

// 查询申报操作日志列表
export function listSelOperLog(query) {
  return request({
    url: '/sel/selOperLog/list',
    method: 'get',
    params: query
  })
}


// 新增申报操作日志
export function addSelOperLog(data) {
  return request({
    url: '/sel/selOperLog',
    method: 'post',
    data: data
  })
}

// 修改申报操作日志
export function updateSelOperLog(data) {
  return request({
    url: '/sel/selOperLog',
    method: 'put',
    data: data
  })
}

// 删除申报操作日志
export function delSelOperLog(id) {
  return request({
    url: '/sel/selOperLog/' + id,
    method: 'delete'
  })
}
