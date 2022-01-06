import request from '@/utils/request'

// 查询专利申报列表
export function listSelDeclarePatent(query) {
  return request({
    url: '/sel/selDeclarePatent/list',
    method: 'get',
    params: query
  })
}

// 查询专利申报详细
export function getSelDeclarePatent(id) {
  return request({
    url: '/sel/selDeclarePatent/' + id,
    method: 'get'
  })
}

// 查询科学技术奖申报详细 通过infoId
export function getSelDeclarePatentByinfo(id) {
  return request({
    url: '/sel/selDeclarePatent/infoId/' + id,
    method: 'get'
  })
}

// 新增专利申报
export function addSelDeclarePatent(data) {
  return request({
    url: '/sel/selDeclarePatent',
    method: 'post',
    data: data
  })
}

// 修改专利申报
export function updateSelDeclarePatent(data) {
  return request({
    url: '/sel/selDeclarePatent',
    method: 'put',
    data: data
  })
}

// 删除专利申报
export function delSelDeclarePatent(id) {
  return request({
    url: '/sel/selDeclarePatent/' + id,
    method: 'delete'
  })
}

// 导出专利申报
export function exportSelDeclarePatent(query) {
  return request({
    url: '/sel/selDeclarePatent/export',
    method: 'get',
    params: query
  })
}
