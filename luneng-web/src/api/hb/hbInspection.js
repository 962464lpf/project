import request from '@/utils/request'

// 查询自查，督查列表
export function listHbInspection(query) {
  return request({
    url: '/hb/hbInspection/list',
    method: 'get',
    params: query
  })
}

// 查询自查，督查详细
export function getHbInspection(id) {
  return request({
    url: '/hb/hbInspection/' + id,
    method: 'get'
  })
}

// 新增自查，督查
export function addHbInspection(data) {
  return request({
    url: '/hb/hbInspection',
    method: 'post',
    data: data
  })
}

// 修改自查，督查
export function updateHbInspection(data) {
  return request({
    url: '/hb/hbInspection',
    method: 'put',
    data: data
  })
}

// 删除自查，督查
export function delHbInspection(id) {
  return request({
    url: '/hb/hbInspection/' + id,
    method: 'delete'
  })
}

// 导出自查，督查
export function exportHbInspection(query) {
  return request({
    url: '/hb/hbInspection/export',
    method: 'get',
    params: query
  })
}