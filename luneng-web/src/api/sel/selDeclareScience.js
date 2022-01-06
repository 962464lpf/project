import request from '@/utils/request'

// 查询科学技术奖申报列表
export function listSelDeclareScience(query) {
  return request({
    url: '/sel/selDeclareScience/list',
    method: 'get',
    params: query
  })
}

// 查询科学技术奖申报详细
export function getSelDeclareScience(id) {
  return request({
    url: '/sel/selDeclareScience/' + id,
    method: 'get'
  })
}

// 查询科学技术奖申报详细 通过infoId
export function getSelDeclareScienceByinfo(id) {
  return request({
    url: '/sel/selDeclareScience/infoId/' + id,
    method: 'get'
  })
}

// 新增科学技术奖申报
export function addSelDeclareScience(data) {
  return request({
    url: '/sel/selDeclareScience',
    method: 'post',
    data: data
  })
}

// 修改科学技术奖申报
export function updateSelDeclareScience(data) {
  return request({
    url: '/sel/selDeclareScience',
    method: 'put',
    data: data
  })
}

// 删除科学技术奖申报
export function delSelDeclareScience(id) {
  return request({
    url: '/sel/selDeclareScience/' + id,
    method: 'delete'
  })
}

// 导出科学技术奖申报
export function exportSelDeclareScience(query) {
  return request({
    url: '/sel/selDeclareScience/export',
    method: 'get',
    params: query
  })
}

// 导出科学技术奖申报
export function getScienceByNoticeId(query) {
  return request({
    url: '/sel/selDeclareScience/getScienceByNoticeId',
    method: 'get',
    params: query
  })
}
