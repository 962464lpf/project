import request from '@/utils/request'

// 查询评选通知列表
export function listSelNotice(query) {
  return request({
    url: '/sel/selNotice/list',
    method: 'get',
    params: query
  })
}
//查看信息列表
export function listSelNessage(query) {
  return request({
    url: '/sel/selNotice/messageList',
    method: 'get',
    params: query
  })
}

// 查询年份
export function listSelReviewYears() {
  return request({
    url: '/sel/selNotice/getYearList',
    method: 'get'
  })
}

// 查询评选通知详细
export function getSelNotice(id) {
  return request({
    url: '/sel/selNotice/' + id,
    method: 'get'
  })
}


export function updateStatusMessage(id){
  return request({
    url: '/sel/selNotice/byMessage/' + id,
    method: 'get'
  })
}


export function byNoticeUpdate(id){
  return request({
    url: '/sel/selNotice/byNotice/' + id,
    method: 'get'
  })
}

export function updateMessage(id){
  return request({
    url: '/sel/selNotice/updateMessage/' + id,
    method: 'get'
  })
}

// 新增评选通知
export function addSelNotice(data) {
  return request({
    url: '/sel/selNotice',
    method: 'post',
    data: data
  })
}

// 修改评选通知
export function updateSelNotice(data) {
  return request({
    url: '/sel/selNotice',
    method: 'put',
    data: data
  })
}

// 删除评选通知
export function delSelNotice(id) {
  return request({
    url: '/sel/selNotice/' + id,
    method: 'delete'
  })
}

// 导出评选通知
export function exportSelNotice(query) {
  return request({
    url: '/sel/selNotice/export',
    method: 'get',
    params: query
  })
}
