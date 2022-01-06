import request from '@/utils/request'

// 查询项目月报列表
export function listProMonthReport(query) {
  return request({
    url: '/pro/proMonthReport/list',
    method: 'get',
    params: query
  })
}

// 查询项目月报列表
export function listProMonthReportAudit(query) {
  return request({
    url: '/pro/proMonthReportRecord/list',
    method: 'get',
    params: query
  })
}

// 查询项目月报详细
export function getProMonthReport(id) {
  return request({
    url: '/pro/proMonthReport/' + id,
    method: 'get'
  })
}

// 新增项目月报
export function addProMonthReport(data) {
  return request({
    url: '/pro/proMonthReport',
    method: 'post',
    data: data
  })
}

// 修改项目月报
export function updateProMonthReport(data) {
  return request({
    url: '/pro/proMonthReport',
    method: 'put',
    data: data
  })
}

// 删除项目月报
export function delProMonthReport(id) {
  return request({
    url: '/pro/proMonthReport/' + id,
    method: 'delete'
  })
}

// 导出项目月报
export function exportProMonthReport(query) {
  return request({
    url: '/pro/proMonthReport/export',
    method: 'get',
    params: query
  })
}
