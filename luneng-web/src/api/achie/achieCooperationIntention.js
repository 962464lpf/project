import request from '@/utils/request'

// 查询成果合作意向列表
export function listAchieCooperationIntention(query) {
  return request({
    url: '/achie/achieCooperationIntention/list',
    method: 'get',
    params: query
  })
}

// 查询成果合作意向详细
export function getAchieCooperationIntention(id) {
  return request({
    url: '/achie/achieCooperationIntention/' + id,
    method: 'get'
  })
}

// 新增成果合作意向
export function addAchieCooperationIntention(data) {
  return request({
    url: '/achie/achieCooperationIntention',
    method: 'post',
    data: data
  })
}

// 修改成果合作意向
export function updateAchieCooperationIntention(data) {
  return request({
    url: '/achie/achieCooperationIntention',
    method: 'put',
    data: data
  })
}

// 删除成果合作意向
export function delAchieCooperationIntention(id) {
  return request({
    url: '/achie/achieCooperationIntention/' + id,
    method: 'delete'
  })
}

// 导出成果合作意向
export function exportAchieCooperationIntention(query) {
  return request({
    url: '/achie/achieCooperationIntention/export',
    method: 'get',
    params: query
  })
}

// 申请合作 data:{infoId(成果展示id),message(申请合作单位留言)}
export function applyCooperation(data) {
  return request({
    url: '/achie/achieCooperationIntention/applyCooperation',
    method: 'post',
    data: data
  })
}
