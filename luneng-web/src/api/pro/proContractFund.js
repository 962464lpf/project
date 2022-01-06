import request from "@/utils/request";

// 查询经费管理列表
export function listFundManagement(query) {
  return request({
    url: '/pro/proContract/list',
    method: 'get',
    params: query
  })
}
// 查询款项凭证列表
export function selectMoneyPlan(query) {
  return request({
    url: '/pro/proMoneyPlan/selectMoneyPlan',
    method: 'get',
    params: query
  })
}

// 查询凭证列表
export function selectMoneyVoucher(query) {
  return request({
    url: '/pro/proMoneyPlanVocher/list',
    method: 'get',
    params: query
  })
}

// 保存款项凭证信息
export function saveMoneyPlanVoucher(data) {
  return request({
    url: '/pro/proMoneyPlanVocher',
    method: 'post',
    data: data
  })
}


