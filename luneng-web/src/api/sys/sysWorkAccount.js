import request from '@/utils/request'

// 查询工作台账列表
export function listSysWorkAccount(query) {
  return request({
    url: '/system/sysWorkAccount/list',
    method: 'get',
    params: query
  })
}

// 查询工作台账详细
export function getSysWorkAccount(id) {
  return request({
    url: '/system/sysWorkAccount/' + id,
    method: 'get'
  })
}

// 新增工作台账
export function addSysWorkAccount(data) {
  return request({
    url: '/system/sysWorkAccount',
    method: 'post',
    data: data
  })
}

// 修改工作台账
export function updateSysWorkAccount(data) {
  return request({
    url: '/system/sysWorkAccount',
    method: 'put',
    data: data
  })
}

// 删除工作台账
export function delSysWorkAccount(id) {
  return request({
    url: '/system/sysWorkAccount/' + id,
    method: 'delete'
  })
}

// 导出工作台账
export function exportSysWorkAccount(query) {
  return request({
    url: '/system/sysWorkAccount/export',
    method: 'get',
    params: query
  })
}

//相关项目
export function getRelevantProjects(id) {
  return request({
    url: '/system/sysWorkAccount/getRelevantProjects/' + id,
    method: 'get'
  })
}
