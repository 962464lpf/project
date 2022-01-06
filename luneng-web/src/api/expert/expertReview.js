import request from '@/utils/request'

// 查询专家评审列表
export function listExpertReview(query) {
  return request({
    url: '/expert/expertReview/list',
    method: 'get',
    params: query
  })
}

// 查询评审项目详情
export function listExpertReviewProj(id) {
  return request({
    url: '/expert/expertReview/reviewList/' + id,
    method: 'get'
  })
}


// 查询专家评审详细
export function getExpertReview(id) {
  return request({
    url: '/expert/expertReview/' + id,
    method: 'get'
  })
}

// 新增专家评审
export function addExpertReview(data) {
  return request({
    url: '/expert/expertReview',
    method: 'post',
    data: data
  })
}

// 修改专家评审
export function updateExpertReview(data) {
  return request({
    url: '/expert/expertReview',
    method: 'put',
    data: data
  })
}

// 选择评审的专家组
export function selExpertReviewGroup(data) {
  return request({
    url: '/expert/expertReview/setExpertGroup',
    method: 'post',
    data: data
  })
}

// 删除专家评审
export function delExpertReview(id) {
  return request({
    url: '/expert/expertReview/' + id,
    method: 'delete'
  })
}

// 导出专家评审
export function exportExpertReview(query) {
  return request({
    url: '/expert/expertReview/export',
    method: 'get',
    params: query
  })
}

// 查询评审时间
export function getBoundaryTime(year) {
  return request({
    url: '/expert/expertReview/getBoundaryTime/' + year,
    method: 'get'
  })
}
