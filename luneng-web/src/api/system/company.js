import request from '@/utils/request'

// 查询企业信息列表
export function listSysCompany(query) {
  return request({
    url: '/system/sysCompany/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息详细
export function getSysCompany(id) {
  return request({
    url: '/system/sysCompany/' + id,
    method: 'get'
  })
}

// 新增企业信息
export function addSysCompany(data) {
  return request({
    url: '/system/sysCompany',
    method: 'post',
    data: data
  })
}

// 修改企业信息
export function updateSysCompany(data) {
  return request({
    url: '/system/sysCompany',
    method: 'put',
    data: data
  })
}

// 删除企业信息
export function delSysCompany(id) {
  return request({
    url: '/system/sysCompany/' + id,
    method: 'delete'
  })
}

// 导出企业信息
export function exportSysCompany(query) {
  return request({
    url: '/system/sysCompany/export',
    method: 'get',
    params: query
  })
}