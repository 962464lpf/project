import request from '@/utils/request'

// 查询任务及经费分解方案列表
export function listProjectStorageFeasibleDecomposition(query) {
  return request({
    url: '/storage/projectStorageFeasibleDecomposition/list',
    method: 'get',
    params: query
  })
}

// 查询任务及经费分解方案详细
export function getProjectStorageFeasibleDecomposition(id) {
  return request({
    url: '/storage/projectStorageFeasibleDecomposition/' + id,
    method: 'get'
  })
}

// 新增任务及经费分解方案
export function addProjectStorageFeasibleDecomposition(data) {
  return request({
    url: '/storage/projectStorageFeasibleDecomposition',
    method: 'post',
    data: data
  })
}

// 修改任务及经费分解方案
export function updateProjectStorageFeasibleDecomposition(data) {
  return request({
    url: '/storage/projectStorageFeasibleDecomposition',
    method: 'put',
    data: data
  })
}

// 删除任务及经费分解方案
export function delProjectStorageFeasibleDecomposition(id) {
  return request({
    url: '/storage/projectStorageFeasibleDecomposition/' + id,
    method: 'delete'
  })
}

// 导出任务及经费分解方案
export function exportProjectStorageFeasibleDecomposition(query) {
  return request({
    url: '/storage/projectStorageFeasibleDecomposition/export',
    method: 'get',
    params: query
  })
}
