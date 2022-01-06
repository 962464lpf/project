import request from '@/utils/request'

// 查询绿建报告列表
// 参数
// infoId 绿建基本信息ID
// type 类型 1：月报（工作简报）2：周报
// time 时间
// createByName 经办人
export function listBuildReport(query) {
  return request({
    url: '/build/buildReport/list',
    method: 'get',
    params: query
  })
}

// 查询绿建报告详细
export function getBuildReport(id) {
  return request({
    url: '/build/buildReport/' + id,
    method: 'get'
  })
}

// 新增绿建报告
export function addBuildReport(data) {
  return request({
    url: '/build/buildReport',
    method: 'post',
    data: data
  })
}

// 修改绿建报告
export function updateBuildReport(data) {
  return request({
    url: '/build/buildReport',
    method: 'put',
    data: data
  })
}

// 删除绿建报告
export function delBuildReport(id) {
  return request({
    url: '/build/buildReport/' + id,
    method: 'delete'
  })
}
