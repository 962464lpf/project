import request from '@/utils/request'

// 查询项目储备申报列表
export function listProjectStorageInfo(query) {
  return request({
    url: '/project/projectStorageReview/list',
    method: 'get',
    params: query
  })
}

//批量设置专家组
export function setExpertGroup(data) {
  return request({
    url: '/project/projectStorageReview/setExpertGroup',
    method: 'post',
    data: data
  })
}

//获取评审详情
export function getReviewDetail(id) {
  return request({
    url: '/project/projectStorageReview/getReviewDetail/' + id,
    method: 'get'
  })
}

export function operation(data) {
  return request({
    url: '/project/projectStorageReview/operation',
    method: 'post',
    data: data
  })
}

//导出专家意见
//参数格式{"declareYear":2020,"infoId":1}  单个申报意见导出需要穿infoId全部导出不需要
export function exportExcel(data) {
  return request({
    url: '/project/projectStorageReview/export',
    method: 'get',
    params: data
  })
}
