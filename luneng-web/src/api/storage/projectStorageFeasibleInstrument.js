import request from '@/utils/request'

// 查询仪器使用费列表
export function listProjectStorageFeasibleInstrument(query) {
  return request({
    url: '/storage/projectStorageFeasibleInstrument/list',
    method: 'get',
    params: query
  })
}

// 查询仪器使用费详细
export function getProjectStorageFeasibleInstrument(id) {
  return request({
    url: '/storage/projectStorageFeasibleInstrument/' + id,
    method: 'get'
  })
}

// 新增仪器使用费
export function addProjectStorageFeasibleInstrument(data) {
  return request({
    url: '/storage/projectStorageFeasibleInstrument',
    method: 'post',
    data: data
  })
}

// 修改仪器使用费
export function updateProjectStorageFeasibleInstrument(data) {
  return request({
    url: '/storage/projectStorageFeasibleInstrument',
    method: 'put',
    data: data
  })
}

// 删除仪器使用费
export function delProjectStorageFeasibleInstrument(id) {
  return request({
    url: '/storage/projectStorageFeasibleInstrument/' + id,
    method: 'delete'
  })
}

// 导出仪器使用费
export function exportProjectStorageFeasibleInstrument(query) {
  return request({
    url: '/storage/projectStorageFeasibleInstrument/export',
    method: 'get',
    params: query
  })
}