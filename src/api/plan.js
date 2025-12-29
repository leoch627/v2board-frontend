import request from './request'

/**
 * 获取套餐列表
 */
export function getPlanList() {
  return request({
    url: '/user/plan/fetch',
    method: 'get',
  })
}
