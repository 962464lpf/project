import request from '@/utils/request'

// 查询月报记录列表
export function listProMonthReportRecord(query) {
  return request({
    url: '/pro/proMonthReportRecord/list',
    method: 'get',
    params: query
  })
}

// 查询月报记录详细
export function getProMonthReportRecord(id) {
  return request({
    url: '/pro/proMonthReportRecord/' + id,
    method: 'get'
  })
}

// 新增月报记录
export function addProMonthReportRecord(data) {
  return request({
    url: '/pro/proMonthReportRecord',
    method: 'post',
    data: data
  })
}

// 修改月报记录
export function updateProMonthReportRecord(data) {
  return request({
    url: '/pro/proMonthReportRecord',
    method: 'put',
    data: data
  })
}

// 已阅，退回接口：
export function changeStatusReportRecord(data) {
  return request({
    url: '/pro/proMonthReportRecord/changeStatus',
    method: 'post',
    data: data
  })
}

// 删除月报记录
export function delProMonthReportRecord(id) {
  return request({
    url: '/pro/proMonthReportRecord/' + id,
    method: 'delete'
  })
}

// 导出月报记录
export function exportProMonthReportRecord(query) {
  return request({
    url: '/pro/proMonthReportRecord/export',
    method: 'get',
    params: query
  })
}

// 预览月报记录
export function previewProMonthReportRecord(query) {
  return request({
    url: '/pro/proMonthReportRecord/preview',
    method: 'get',
    params: query
  })
}
