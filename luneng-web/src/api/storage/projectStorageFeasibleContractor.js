import request from '@/utils/request'

// 查询外委研究支出预算明细列表
export function listProjectStorageFeasibleContractor(query) {
  return request({
    url: '/storage/projectStorageFeasibleContractor/list',
    method: 'get',
    params: query
  })
}

// 查询外委研究支出预算明细详细
export function getProjectStorageFeasibleContractor(id) {
  return request({
    url: '/storage/projectStorageFeasibleContractor/' + id,
    method: 'get'
  })
}

// 新增外委研究支出预算明细
export function addProjectStorageFeasibleContractor(data) {
  return request({
    url: '/storage/projectStorageFeasibleContractor',
    method: 'post',
    data: data
  })
}

// 修改外委研究支出预算明细
export function updateProjectStorageFeasibleContractor(data) {
  return request({
    url: '/storage/projectStorageFeasibleContractor',
    method: 'put',
    data: data
  })
}

// 删除外委研究支出预算明细
export function delProjectStorageFeasibleContractor(id) {
  return request({
    url: '/storage/projectStorageFeasibleContractor/' + id,
    method: 'delete'
  })
}

// 导出外委研究支出预算明细
export function exportProjectStorageFeasibleContractor(query) {
  return request({
    url: '/storage/projectStorageFeasibleContractor/export',
    method: 'get',
    params: query
  })
}