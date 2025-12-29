import request from './request'

/**
 * 获取订单列表
 */
export function getOrderList() {
  return request({
    url: '/user/order/fetch',
    method: 'get',
  })
}

/**
 * 获取订单详情
 * @param {string} trade_no - 订单号
 */
export function getOrderDetail(trade_no) {
  return request({
    url: '/user/order/detail',
    method: 'get',
    params: { trade_no },
  })
}

/**
 * 创建订单
 * @param {number} plan_id - 套餐ID
 * @param {string} period - 周期
 * @param {string} coupon_code - 优惠码（可选）
 */
export function createOrder(data) {
  return request({
    url: '/user/order/save',
    method: 'post',
    data,
  })
}

/**
 * 订单支付
 * @param {string} trade_no - 订单号
 * @param {number} method - 支付方式
 */
export function checkoutOrder(data) {
  return request({
    url: '/user/order/checkout',
    method: 'post',
    data,
  })
}

/**
 * 取消订单
 * @param {string} trade_no - 订单号
 */
export function cancelOrder(data) {
  return request({
    url: '/user/order/cancel',
    method: 'post',
    data,
  })
}

/**
 * 获取支付方式
 */
export function getPaymentMethods() {
  return request({
    url: '/user/order/getPaymentMethod',
    method: 'get',
  })
}
