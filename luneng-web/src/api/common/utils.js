import request from '@/utils/request'
//自动生成编号
//生成合同编号
export function createcode(param) {
  return request({
    url: '/common/createCode',
    method: 'get',
    params: {'key' : param }
  })
}

//获取流程图
export function getActivitiProccessImage(instanceId) {
  return request({
    url: '/ac/model/read-resource/'+instanceId,
    method: 'get'
  })
}

//生成助记符
export function createZjf(str) {
  return request({
    url: '/common/createZjf',
    method: 'post',
    params: {'key' : str }
  })
}

//base64转PDF
export function base64ToPDF(data) {
  return request({
    url: '/common/base64ToPDF',
    method: 'post',
    data
  })
}

export function downloadPDF(data) {
  return request({
    url: '/common/getpdf',
    method: 'post',
    data: data
  })
}

// 用户上传文件或者图片
export function uploadFile(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: data
  })
}



export function pdfToWord(params) {
  return request({
    url: '/common/pdfToWord',
    method: 'get',
    params: params
  })
}

export function downloadFile(params) {
  return request({
    url: '/common/download/resource',
    method: 'get',
    params: params
  })
}

// word预览
export function wordToHtml(data) {
  return request({
    url: '/free2/wordToHtml',
    method: 'post',
    data: data
  })
}



