import request from '@/utils/request'

// 查询可研报告主列表
export function listProjectStorageFeasible(query) {
  return request({
    url: '/storage/projectStorageFeasible/list',
    method: 'get',
    params: query
  })
}

// 查询可研报告主详细
export function getProjectStorageFeasible(id) {
  return request({
    url: '/storage/projectStorageFeasible/' + id,
    method: 'get'
  })
}

// 查询可研报告主详细 通过infoId
export function getProjectStorageFeasibleByInfoId(id) {
  return request({
    url: '/storage/projectStorageFeasible/getInfoByInfoId/' + id,
    method: 'get'
  })
}

// 新增可研报告主
export function addProjectStorageFeasible(data) {
  return request({
    url: '/storage/projectStorageFeasible',
    method: 'post',
    data: data
  })
}

// 修改可研报告主
export function updateProjectStorageFeasible(data) {
  return request({
    url: '/storage/projectStorageFeasible',
    method: 'put',
    data: data
  })
}

// 删除可研报告主
export function delProjectStorageFeasible(id) {
  return request({
    url: '/storage/projectStorageFeasible/' + id,
    method: 'delete'
  })
}

// 导出可研报告主
export function exportProjectStorageFeasible(query) {
  return request({
    url: '/storage/projectStorageFeasible/export',
    method: 'get',
    params: query
  })
}
