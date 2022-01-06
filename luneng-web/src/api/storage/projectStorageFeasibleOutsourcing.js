import request from '@/utils/request'

// 查询外协测试试验与加工费预算明细列表
export function listProjectStorageFeasibleOutsourcing(query) {
  return request({
    url: '/storage/projectStorageFeasibleOutsourcing/list',
    method: 'get',
    params: query
  })
}

// 查询外协测试试验与加工费预算明细详细
export function getProjectStorageFeasibleOutsourcing(id) {
  return request({
    url: '/storage/projectStorageFeasibleOutsourcing/' + id,
    method: 'get'
  })
}

// 新增外协测试试验与加工费预算明细
export function addProjectStorageFeasibleOutsourcing(data) {
  return request({
    url: '/storage/projectStorageFeasibleOutsourcing',
    method: 'post',
    data: data
  })
}

// 修改外协测试试验与加工费预算明细
export function updateProjectStorageFeasibleOutsourcing(data) {
  return request({
    url: '/storage/projectStorageFeasibleOutsourcing',
    method: 'put',
    data: data
  })
}

// 删除外协测试试验与加工费预算明细
export function delProjectStorageFeasibleOutsourcing(id) {
  return request({
    url: '/storage/projectStorageFeasibleOutsourcing/' + id,
    method: 'delete'
  })
}

// 导出外协测试试验与加工费预算明细
export function exportProjectStorageFeasibleOutsourcing(query) {
  return request({
    url: '/storage/projectStorageFeasibleOutsourcing/export',
    method: 'get',
    params: query
  })
}