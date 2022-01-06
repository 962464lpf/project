import request from '@/utils/request'

// 查询奖励建议列表
export function listSelRewardSuggest(query) {
  return request({
    url: '/sel/selRewardSuggest/list',
    method: 'get',
    params: query
  })
}

// 查询奖励建议详细
export function getSelRewardSuggest(id) {
  return request({
    url: '/sel/selRewardSuggest/' + id,
    method: 'get'
  })
}

// 新增奖励建议
export function addSelRewardSuggest(data) {
  return request({
    url: '/sel/selRewardSuggest',
    method: 'post',
    data: data
  })
}

// 修改奖励建议
export function updateSelRewardSuggest(data) {
  return request({
    url: '/sel/selRewardSuggest',
    method: 'put',
    data: data
  })
}

// 删除奖励建议
export function delSelRewardSuggest(id) {
  return request({
    url: '/sel/selRewardSuggest/' + id,
    method: 'delete'
  })
}

// 生成奖励建议
export function createRewardSuggestFile(id) {
  return request({
    url: '/sel/selRewardSuggest/createRewardSuggestFile/'+ id,
    method: 'get'
  })
}

// 生成奖励建议
export function searchAwardProjectCount(id) {
  return request({
    url: '/sel/selRewardSuggest/searchAwardProjectCount/'+ id,
    method: 'get'
  })
}

