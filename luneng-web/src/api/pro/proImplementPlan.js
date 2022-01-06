// 查询项目立项信息列表
import request from "@/utils/request";

//项目实施列表
export function listProPlayPlan(query) {
  return request({
    url: '/pro/proApprovalInfo/playList',
    method: 'get',
    params: query
  })
}

//项目实施成果列表
export function listProPlayPlanResult(id) {
  return request({
    url: '/pro/proApprovalInfo/playResultList/' + id,
    method: 'get'
  })
}

//项目实施成果历史文件
export function listProPlayPlanResultHis(query) {
  return request({
    url: '/pro/proApprovalInfo/playResultHisList',
    method: 'get',
    params: query
  })
}

// 修改项目立项信息
export function updatePlanResult(data) {
  return request({
    url: '/pro/proPlayPlanResult/updateResult',
    method: 'post',
    data: data
  })
}

//查询成果文件详情
export function getPlanFileResult(id) {
  return request({
    url: '/pro/proApprovalInfo/getPlanResult/' + id,
    method: 'get'
  })
}

//成果文件当前历史记录
export function listCurResultFileHis(query) {
  return request({
    url: '/pro/playPlanResultHis/list',
    method: 'get',
    params: query
  })
}

