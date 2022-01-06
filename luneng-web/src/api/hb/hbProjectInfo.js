import request from '@/utils/request'

// 查询环保项目信息列表
export function listHbProjectInfo(query) {
  return request({
    url: '/hb/hbProjectInfo/list',
    method: 'get',
    params: query
  })
}

// 查询环保项目信息详细
export function getHbProjectInfo(id) {
  return request({
    url: '/hb/hbProjectInfo/' + id,
    method: 'get'
  })
}

// 新增环保项目信息
export function addHbProjectInfo(data) {
  return request({
    url: '/hb/hbProjectInfo',
    method: 'post',
    data: data
  })
}

// 修改环保项目信息
export function updateHbProjectInfo(data) {
  return request({
    url: '/hb/hbProjectInfo',
    method: 'put',
    data: data
  })
}

// 删除环保项目信息
export function delHbProjectInfo(id) {
  return request({
    url: '/hb/hbProjectInfo/' + id,
    method: 'delete'
  })
}

// 导出环保项目信息
export function exportHbProjectInfo(query) {
  return request({
    url: '/hb/hbProjectInfo/export',
    method: 'get',
    params: query
  })
}

// 上传/更新环保文件
export function updateFile(data) {
  return request({
    url: '/hb/hbProjectInfo/updateFile',
    method: 'post',
    data: data
  })
}

// 查看环保文件
export function viewFile(query) {
  return request({
    url: '/hb/hbProjectInfo/viewFile',
    method: 'get',
    params: query
  })
}

export function batchCreateZipFile(data) {
  return request({
    url: '/hb/hbProjectInfo/batchCreateZipFile',
    method: 'post',
    data: data
  })
}

//批量归档
export function doFile(data) {
  return request({
    url: '/hb/hbProjectInfo/doFile',
    method: 'post',
    data
  })
}

//设置周报开关
export function changeSwitch(data) {
  return request({
    url: '/hb/hbProjectInfo/changeSwitch',
    method: 'post',
    data
  })
}

