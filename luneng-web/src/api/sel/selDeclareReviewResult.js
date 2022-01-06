import request from '@/utils/request'

// 查询申报评选结果列表
export function listSelDeclareReviewResult(query) {
  return request({
    url: '/sel/selDeclareReviewResult/list',
    method: 'get',
    params: query
  })
}

// 查询申报评选结果
export function getSelDeclareReviewResult(id) {
  return request({
    url: '/sel/selDeclareReviewResult/' + id,
    method: 'get'
  })
}


// 查询公式表彰列表
export function getRecognitionList(query) {
  return request({
    url: '/sel/selDeclareReviewResult/getRecognitionList',
    method: 'get',
    params: query
  })
}

// 查询申报评选结果所有打分汇总
export function getReviewResultScoreInfo(id) {
  return request({
    url: '/sel/selDeclareReviewResult/getScoreResult/' + id,
    method: 'get'
  })
}

// 修改申报评选结果
export function updateSelDeclareReviewResult(data) {
  return request({
    url: '/sel/selDeclareReviewResult',
    method: 'put',
    data: data
  })
}

/**
 * 评审结束
 * @param ids
 */
export function reviewEnd(query) {
  return request({
    url: '/sel/selDeclareReviewResult/batchSave',
    method: 'post',
    data: query
  })
}

/**
 * 证书下发，批量下发传选中的id，全部下发不传参数
 * @param ids
 */
export function batchRelease(query) {
  return request({
    url: '/sel/selDeclareReviewResult/batchRelease',
    method: 'post',
    data: query
  })
}

/**
 * 上下移动
 * @param data
 */
export function move(data) {
  return request({
    url: '/sel/selDeclareReviewResult/move',
    method: 'post',
    data: data
  })
}

/**
 * 定时任务测试
 */
export function taskTest() {
  return request({
    url: '/sel/selDeclareReviewResult/test',
    method: 'get'
  })
}
