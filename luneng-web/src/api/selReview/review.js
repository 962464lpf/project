import request from '@/utils/request'

// 在线评审列表
export function list(query) {
  return request({
    url: '/expert/reviewScoreInfo/list',
    method: 'get',
    params: query
  })
}

// 打分提交
export function saveScore(query) {
  return request({
    url: '/expert/reviewScore/save',
    method: 'post',
    data: query
  })
}

export function getScoreInfo(query) {
  return request({
    url: '/expert/reviewScore/getInfo',
    method: 'get',
    params: query
  })
}
