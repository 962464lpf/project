import request from '@/utils/request'

// 查询材料费列表
export function listProjectStorageFeasibleMaterial(query) {
  return request({
    url: '/storage/projectStorageFeasibleMaterial/list',
    method: 'get',
    params: query
  })
}

// 查询材料费详细
export function getProjectStorageFeasibleMaterial(id) {
  return request({
    url: '/storage/projectStorageFeasibleMaterial/' + id,
    method: 'get'
  })
}

// 新增材料费
export function addProjectStorageFeasibleMaterial(data) {
  return request({
    url: '/storage/projectStorageFeasibleMaterial',
    method: 'post',
    data: data
  })
}

// 修改材料费
export function updateProjectStorageFeasibleMaterial(data) {
  return request({
    url: '/storage/projectStorageFeasibleMaterial',
    method: 'put',
    data: data
  })
}

// 删除材料费
export function delProjectStorageFeasibleMaterial(id) {
  return request({
    url: '/storage/projectStorageFeasibleMaterial/' + id,
    method: 'delete'
  })
}

// 导出材料费
export function exportProjectStorageFeasibleMaterial(query) {
  return request({
    url: '/storage/projectStorageFeasibleMaterial/export',
    method: 'get',
    params: query
  })
}