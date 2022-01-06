import request from '@/utils/request'

// 查询环保问题整改记录列表
export function listHbRectRecord(query) {
  return request({
    url: '/hb/hbRectRecord/list',
    method: 'get',
    params: query
  })
}

// 查询环保问题整改记录详细
export function getHbRectRecord(id) {
  return request({
    url: '/hb/hbRectRecord/' + id,
    method: 'get'
  })
}

// 新增环保问题整改记录
export function addHbRectRecord(data) {
  return request({
    url: '/hb/hbRectRecord',
    method: 'post',
    data: data
  })
}

// 修改环保问题整改记录
export function updateHbRectRecord(data) {
  return request({
    url: '/hb/hbRectRecord',
    method: 'put',
    data: data
  })
}

// 删除环保问题整改记录
export function delHbRectRecord(id) {
  return request({
    url: '/hb/hbRectRecord/' + id,
    method: 'delete'
  })
}

// 导出环保问题整改记录
export function exportHbRectRecord(query) {
  return request({
    url: '/hb/hbRectRecord/export',
    method: 'get',
    params: query
  })
}