import request from '@/utils/request'

// 查询施工评价列表
// 参数
// infoId 绿建基本信息ID
// projectName 项目名字
// time 时间
// operator 经办人
export function listBuildAppraise(query) {
  return request({
    url: '/build/buildAppraise/list',
    method: 'get',
    params: query
  })
}

// 查询施工评价详细
export function getBuildAppraise(id) {
  return request({
    url: '/build/buildAppraise/' + id,
    method: 'get'
  })
}

// 新增施工评价
export function addBuildAppraise(data) {
  return request({
    url: '/build/buildAppraise',
    method: 'post',
    data: data
  })
}

// 修改施工评价
export function updateBuildAppraise(data) {
  return request({
    url: '/build/buildAppraise',
    method: 'put',
    data: data
  })
}

// 删除施工评价
export function delBuildAppraise(id) {
  return request({
    url: '/build/buildAppraise/' + id,
    method: 'delete'
  })
}
