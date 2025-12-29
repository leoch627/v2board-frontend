import request from './request'

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

/**
 * 获取用户统计信息
 */
export function getUserStat() {
  return request({
    url: '/user/getStat',
    method: 'get',
  })
}

/**
 * 获取订阅信息
 */
export function getSubscribe() {
  return request({
    url: '/user/getSubscribe',
    method: 'get',
  })
}

/**
 * 修改密码
 * @param {string} old_password - 旧密码
 * @param {string} new_password - 新密码
 */
export function changePassword(data) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data,
  })
}

/**
 * 重置订阅链接
 */
export function resetSubscribe() {
  return request({
    url: '/user/resetSecurity',
    method: 'post',
  })
}
