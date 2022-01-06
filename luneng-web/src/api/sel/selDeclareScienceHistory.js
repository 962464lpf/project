import request from '@/utils/request'

// 查询本项目曾获科技奖励情况列表
export function listSelDeclareScienceHistory(query) {
  return request({
    url: '/sel/selDeclareScienceHistory/list',
    method: 'get',
    params: query
  })
}

// 查询本项目曾获科技奖励情况详细
export function getSelDeclareScienceHistory(id) {
  return request({
    url: '/sel/selDeclareScienceHistory/' + id,
    method: 'get'
  })
}

// 新增本项目曾获科技奖励情况
export function addSelDeclareScienceHistory(data) {
  return request({
    url: '/sel/selDeclareScienceHistory',
    method: 'post',
    data: data
  })
}

// 修改本项目曾获科技奖励情况
export function updateSelDeclareScienceHistory(data) {
  return request({
    url: '/sel/selDeclareScienceHistory',
    method: 'put',
    data: data
  })
}

// 删除本项目曾获科技奖励情况
export function delSelDeclareScienceHistory(id) {
  return request({
    url: '/sel/selDeclareScienceHistory/' + id,
    method: 'delete'
  })
}

// 导出本项目曾获科技奖励情况
export function exportSelDeclareScienceHistory(query) {
  return request({
    url: '/sel/selDeclareScienceHistory/export',
    method: 'get',
    params: query
  })
}