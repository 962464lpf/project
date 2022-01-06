import request from '@/utils/request'

// 查询模板设置列表
export function listSysTemplate(query) {
  return request({
    url: '/system/sysTemplate/list',
    method: 'get',
    params: query
  })
}

// 查询模板设置详细
export function getSysTemplate(id) {
  return request({
    url: '/system/sysTemplate/' + id,
    method: 'get'
  })
}

// 新增模板设置
export function addSysTemplate(data) {
  return request({
    url: '/system/sysTemplate',
    method: 'post',
    data: data
  })
}

// 修改模板设置
export function updateSysTemplate(data) {
  return request({
    url: '/system/sysTemplate',
    method: 'put',
    data: data
  })
}

// 删除模板设置
export function delSysTemplate(id) {
  return request({
    url: '/system/sysTemplate/' + id,
    method: 'delete'
  })
}

// 导出模板设置
export function exportSysTemplate(query) {
  return request({
    url: '/system/sysTemplate/export',
    method: 'get',
    params: query
  })
}