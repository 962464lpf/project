import request from '@/utils/request'

// 查询问题整改记录回复列表
export function listHbRectReply(query) {
  return request({
    url: '/hb/hbRectReply/list',
    method: 'get',
    params: query
  })
}

// 查询问题整改记录回复详细
export function getHbRectReply(id) {
  return request({
    url: '/hb/hbRectReply/' + id,
    method: 'get'
  })
}

// 新增问题整改记录回复
export function addHbRectReply(data) {
  return request({
    url: '/hb/hbRectReply',
    method: 'post',
    data: data
  })
}

// 修改问题整改记录回复
export function updateHbRectReply(data) {
  return request({
    url: '/hb/hbRectReply',
    method: 'put',
    data: data
  })
}

// 删除问题整改记录回复
export function delHbRectReply(id) {
  return request({
    url: '/hb/hbRectReply/' + id,
    method: 'delete'
  })
}

// 导出问题整改记录回复
export function exportHbRectReply(query) {
  return request({
    url: '/hb/hbRectReply/export',
    method: 'get',
    params: query
  })
}
