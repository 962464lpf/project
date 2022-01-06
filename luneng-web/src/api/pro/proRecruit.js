// 查询项目立项信息列表
import request from "@/utils/request";

//查询招采列表
export function listProRecruitInfo(query) {
  return request({
    url: '/pro/proApprovalInfo/tenderList',
    method: 'get',
    params: query
  })
}

//修改招采信息
export function updateProRecruitInfo(data) {
  return request({
    url: '/pro/proApprovalInfo/updateProRecruitInfo',
    method: 'post',
    data: data
  })
}

//上传招标资料
export function uploadTenderInfo(data) {
  return request({
    url: '/pro/proApprovalInfo/uploadTenderInfo',
    method: 'post',
    data: data
  })
}

//查询招采文件历史列表
export function listBiddingFilesHis(query) {
  return request({
    url: '/pro/proBiddingFilesHis/list',
    method: 'get',
    params: query
  })
}

// 查询招采合同信息
export function getContractInfo(id) {
  return request({
    url: '/pro/proContract/selectContract/' + id,
    method: 'get'
  })
}

// 添加招采合同信息
export function addBatchContractInfo(data) {
  return request({
    url: '/pro/proContract/addBatch',
    method: 'post',
    data: data
  })
}
