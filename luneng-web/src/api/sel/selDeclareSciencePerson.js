import request from '@/utils/request'

// 查询主要完成人情况列表
export function listSelDeclareSciencePerson(query) {
  return request({
    url: '/sel/selDeclareSciencePerson/list',
    method: 'get',
    params: query
  })
}

// 查询主要完成人情况详细
export function getSelDeclareSciencePerson(id) {
  return request({
    url: '/sel/selDeclareSciencePerson/' + id,
    method: 'get'
  })
}

// 新增主要完成人情况
export function addSelDeclareSciencePerson(data) {
  return request({
    url: '/sel/selDeclareSciencePerson',
    method: 'post',
    data: data
  })
}

// 修改主要完成人情况
export function updateSelDeclareSciencePerson(data) {
  return request({
    url: '/sel/selDeclareSciencePerson',
    method: 'put',
    data: data
  })
}

// 删除主要完成人情况
export function delSelDeclareSciencePerson(id) {
  return request({
    url: '/sel/selDeclareSciencePerson/' + id,
    method: 'delete'
  })
}

// 导出主要完成人情况
export function exportSelDeclareSciencePerson(query) {
  return request({
    url: '/sel/selDeclareSciencePerson/export',
    method: 'get',
    params: query
  })
}