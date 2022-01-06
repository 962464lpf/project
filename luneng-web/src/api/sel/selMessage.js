import request from '@/utils/request'

// 查询消息主体列表
export function listSelMessage(query) {
  return request({
    url: '/sel/selMessage/list',
    method: 'get',
    params: query
  })
}

// 查询消息主体详细
export function getSelMessage(id) {
  return request({
    url: '/sel/selMessage/' + id,
    method: 'get'
  })
}

// 新增消息主体
export function addSelMessage(data) {
  return request({
    url: '/sel/selMessage',
    method: 'post',
    data: data
  })
}

// 修改消息主体
export function updateSelMessage(data) {
  return request({
    url: '/sel/selMessage',
    method: 'put',
    data: data
  })
}

// 删除消息主体
export function delSelMessage(id) {
  return request({
    url: '/sel/selMessage/' + id,
    method: 'delete'
  })
}

// 导出消息主体
export function exportSelMessage(query) {
  return request({
    url: '/sel/selMessage/export',
    method: 'get',
    params: query
  })
}

export function sendMessage(userName) {
  return request({
    url: '/sel/selNotice/sendMessage/' + userName,
    method: 'get'
  })
}
