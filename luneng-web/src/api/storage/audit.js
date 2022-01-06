import request from '@/utils/request'

// 查询项目储备申报列表
export function listProjectStorageInfo(query) {
  return request({
    url: '/project/projectStorageAudit/list',
    method: 'get',
    params: query
  })
}

// 获取统计信息
export function getStatisticalNum(params) {
  return request({
    url: '/project/projectStorageAudit/getStatisticalNum',
    method: 'get',
    params: params
  })
}

// 查询
export function getProjectStorageAudit(id) {
  return request({
    url: '/project/projectStorageAudit/' + id,
    method: 'get'
  })
}

// 审核页面操作 operation:1：审核同意，2：退回，3：拒绝
// 参数格式{"infoId":1,"operation":1,"remark":"1234","filePaths":"123456"}
export function operation(data) {
  return request({
    url: '/project/projectStorageAudit/operation',
    method: 'post',
    data: data
  })
}

export function exportExcel(data) {
  return request({
    url: '/project/projectStorageAudit/export',
    method: 'get',
    params: data
  })
}
