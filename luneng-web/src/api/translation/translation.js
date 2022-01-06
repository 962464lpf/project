import request from '@/utils/request'

// 翻译字典数据
export function getDictData(query) {
  return request({
    url: '/system/dict/data/typeValue',
    method: 'get',
    params: query
  })
}
