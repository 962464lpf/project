import request from '@/utils/request'

// 查询消息主体列表
export function listInfo(query) {
  return request({
    url: '/msg/info/list',
    method: 'get',
    params: query
  })
}

// 查询消息主体详细
export function getInfo(id) {
  return request({
    url: '/msg/info/' + id,
    method: 'get'
  })
}

// 新增消息主体
export function addInfo(data) {
  return request({
    url: '/msg/info',
    method: 'post',
    data: data
  })
}

// 提交消息通知
export function reviewInfo(data) {
  return request({
    url: '/msg/info/review',
    method: 'put',
    data: data
  })
}

// 修改消息主体
export function updateInfo(data) {
  return request({
    url: '/msg/info',
    method: 'put',
    data: data
  })
}

// 删除消息主体
export function delInfo(id) {
  return request({
    url: '/msg/info/' + id,
    method: 'delete'
  })
}

// 导出消息主体
export function exportInfo(query) {
  return request({
    url: '/msg/info/export',
    method: 'get',
    params: query
  })
}

// 查询待办事项接口
export function undoneMatter() {
  return request({
    url: '/homePage/daiban',
    method: 'get'
  })
}
