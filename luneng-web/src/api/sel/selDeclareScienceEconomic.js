import request from '@/utils/request'

// 查询科技进步奖经济效益列表
export function listSelDeclareScienceEconomic(query) {
  return request({
    url: '/sel/selDeclareScienceEconomic/list',
    method: 'get',
    params: query
  })
}

// 查询科技进步奖经济效益详细
export function getSelDeclareScienceEconomic(id) {
  return request({
    url: '/sel/selDeclareScienceEconomic/' + id,
    method: 'get'
  })
}

// 新增科技进步奖经济效益
export function addSelDeclareScienceEconomic(data) {
  return request({
    url: '/sel/selDeclareScienceEconomic',
    method: 'post',
    data: data
  })
}

// 修改科技进步奖经济效益
export function updateSelDeclareScienceEconomic(data) {
  return request({
    url: '/sel/selDeclareScienceEconomic',
    method: 'put',
    data: data
  })
}

// 删除科技进步奖经济效益
export function delSelDeclareScienceEconomic(id) {
  return request({
    url: '/sel/selDeclareScienceEconomic/' + id,
    method: 'delete'
  })
}

// 导出科技进步奖经济效益
export function exportSelDeclareScienceEconomic(query) {
  return request({
    url: '/sel/selDeclareScienceEconomic/export',
    method: 'get',
    params: query
  })
}