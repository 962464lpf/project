import request from '@/utils/request'

// 查询可研报告经费列表
export function listProjectStorageFeasibleCost(query) {
  return request({
    url: '/storage/projectStorageFeasibleCost/list',
    method: 'get',
    params: query
  })
}

// 查询可研报告经费详细
export function getProjectStorageFeasibleCost(id) {
  return request({
    url: '/storage/projectStorageFeasibleCost/' + id,
    method: 'get'
  })
}

// 新增可研报告经费
export function addProjectStorageFeasibleCost(data) {
  return request({
    url: '/storage/projectStorageFeasibleCost',
    method: 'post',
    data: data
  })
}

// 修改可研报告经费
export function updateProjectStorageFeasibleCost(data) {
  return request({
    url: '/storage/projectStorageFeasibleCost',
    method: 'put',
    data: data
  })
}

// 删除可研报告经费
export function delProjectStorageFeasibleCost(id) {
  return request({
    url: '/storage/projectStorageFeasibleCost/' + id,
    method: 'delete'
  })
}

// 导出可研报告经费
export function exportProjectStorageFeasibleCost(query) {
  return request({
    url: '/storage/projectStorageFeasibleCost/export',
    method: 'get',
    params: query
  })
}