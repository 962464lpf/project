import request from '@/utils/request'

// 查询消息列表
export function listMessage(query) {
  return request({
    url: '/msg/message/list',
    method: 'get',
    params: query
  })
}

// 查询消息详细
export function getMessage(msgId) {
  return request({
    url: '/msg/message/' + msgId,
    method: 'get'
  })
}

// 新增消息
export function addMessage(data) {
  return request({
    url: '/msg/message',
    method: 'post',
    data: data
  })
}

// 修改消息
export function updateMessage(data) {
  return request({
    url: '/msg/message',
    method: 'put',
    data: data
  })
}

// 删除消息
export function delMessage(msgId) {
  return request({
    url: '/msg/message/' + msgId,
    method: 'delete'
  })
}

// 导出消息
export function exportMessage(query) {
  return request({
    url: '/msg/message/export',
    method: 'get',
    params: query
  })
}

// 查询消息列表
export function byDateMessage(query) {
  return request({
    url: '/msg/message/byDate',
    method: 'get',
    params: query
  })
}

// 忽略消息
export function updateStatusMessage(data) {
  return request({
    url: '/msg/message/updateStatus',
    method: 'post',
    data: data
  })
}