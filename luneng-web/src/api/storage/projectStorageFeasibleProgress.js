import request from '@/utils/request'

// 查询可研报告进度列表
export function listProjectStorageFeasibleProgress(query) {
  return request({
    url: '/storage/projectStorageFeasibleProgress/list',
    method: 'get',
    params: query
  })
}

// 查询可研报告进度详细
export function getProjectStorageFeasibleProgress(id) {
  return request({
    url: '/storage/projectStorageFeasibleProgress/' + id,
    method: 'get'
  })
}

// 新增可研报告进度
export function addProjectStorageFeasibleProgress(data) {
  return request({
    url: '/storage/projectStorageFeasibleProgress',
    method: 'post',
    data: data
  })
}

// 修改可研报告进度
export function updateProjectStorageFeasibleProgress(data) {
  return request({
    url: '/storage/projectStorageFeasibleProgress',
    method: 'put',
    data: data
  })
}

// 删除可研报告进度
export function delProjectStorageFeasibleProgress(id) {
  return request({
    url: '/storage/projectStorageFeasibleProgress/' + id,
    method: 'delete'
  })
}

// 导出可研报告进度
export function exportProjectStorageFeasibleProgress(query) {
  return request({
    url: '/storage/projectStorageFeasibleProgress/export',
    method: 'get',
    params: query
  })
}