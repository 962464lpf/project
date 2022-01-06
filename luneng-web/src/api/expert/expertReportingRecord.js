import request from '@/utils/request'

// 查询上报专家记录列表
export function listExpertReportingRecord(query) {
  return request({
    url: '/expert/expertReportingRecord/list',
    method: 'get',
    params: query
  })
}

// 查询上报专家记录详细
export function getExpertReportingRecord(id) {
  return request({
    url: '/expert/expertReportingRecord/' + id,
    method: 'get'
  })
}

// 新增上报专家记录
export function addExpertReportingRecord(data) {
  return request({
    url: '/expert/expertReportingRecord',
    method: 'post',
    data: data
  })
}

// 修改上报专家记录
export function updateExpertReportingRecord(data) {
  return request({
    url: '/expert/expertReportingRecord',
    method: 'put',
    data: data
  })
}

// 删除上报专家记录
export function delExpertReportingRecord(id) {
  return request({
    url: '/expert/expertReportingRecord/' + id,
    method: 'delete'
  })
}

// 导出上报专家记录
export function exportExpertReportingRecord(query) {
  return request({
    url: '/expert/expertReportingRecord/export',
    method: 'get',
    params: query
  })
}

// 专家入库 id:上报专家记录id
export function reportExpertReportingRecord(id) {
  return request({
    url: '/expert/expertReportingRecord/ruku/'+id,
    method: 'get'
  })
}
// 专家落选 id:上报专家记录id
export function refuseExpertReportingRecord(id) {
  return request({
    url: '/expert/expertReportingRecord/luoxuan/'+id,
    method: 'get'
  })
}

export function downloadTemp() {
  return request({
    url: '/expert/expertReportingRecord/downloadTemp',
    method: 'get',
    responseType: 'blob'
  })
}
