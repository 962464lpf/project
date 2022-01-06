import request from '@/utils/request'

// 查询环保项目工作报告列表
export function listHbWorkReport(query) {
  return request({
    url: '/hb/hbWorkReport/list',
    method: 'get',
    params: query
  })
}

// 查询环保项目工作报告详细
export function getHbWorkReport(id) {
  return request({
    url: '/hb/hbWorkReport/' + id,
    method: 'get'
  })
}

// 新增环保项目工作报告
export function addHbWorkReport(data) {
  return request({
    url: '/hb/hbWorkReport',
    method: 'post',
    data: data
  })
}

// 修改环保项目工作报告
export function updateHbWorkReport(data) {
  return request({
    url: '/hb/hbWorkReport',
    method: 'put',
    data: data
  })
}

// 删除环保项目工作报告
export function delHbWorkReport(id) {
  return request({
    url: '/hb/hbWorkReport/' + id,
    method: 'delete'
  })
}

// 导出环保项目工作报告
export function exportHbWorkReport(query) {
  return request({
    url: '/hb/hbWorkReport/export',
    method: 'get',
    params: query
  })
}