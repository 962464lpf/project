import request from '@/utils/request'

// 查询项目建议列表
export function listProjectStorageAdvice(query) {
  return request({
    url: '/project/projectStorageAdvice/list',
    method: 'get',
    params: query
  })
}

// 查询项目建议详细
export function getProjectStorageAdvice(id) {
  return request({
    url: '/project/projectStorageAdvice/' + id,
    method: 'get'
  })
}

// 新增项目建议
export function addProjectStorageAdvice(data) {
  return request({
    url: '/project/projectStorageAdvice',
    method: 'post',
    data: data
  })
}

// 修改项目建议
export function updateProjectStorageAdvice(data) {
  return request({
    url: '/project/projectStorageAdvice',
    method: 'put',
    data: data
  })
}

// 删除项目建议
export function delProjectStorageAdvice(id) {
  return request({
    url: '/project/projectStorageAdvice/' + id,
    method: 'delete'
  })
}

// 导出项目建议
export function exportProjectStorageAdvice(query) {
  return request({
    url: '/project/projectStorageAdvice/export',
    method: 'get',
    params: query
  })
}
