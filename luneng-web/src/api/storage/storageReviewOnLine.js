import request from '@/utils/request'

// 查询项目储备申报列表
export function listProjectStorageInfo(query) {
  return request({
    url: '/project/onLineReview/list',
    method: 'get',
    params: query
  })
}

// 在线评审操作 operation:0:同意，1：不同意，2：点击详情，3：点击评审
// 参数格式{"infoId":1,"expertId":"1","operation":0}
export function operation(data) {
  return request({
    url: '/project/onLineReview/operation',
    method: 'post',
    data: data
  })
}
