import request from './request'

/**
 * 用户登录
 * @param {string} email - 邮箱
 * @param {string} password - 密码
 */
export function login(data) {
  return request({
    url: '/passport/auth/login',
    method: 'post',
    data,
  })
}

/**
 * 用户注册
 * @param {string} email - 邮箱
 * @param {string} password - 密码
 * @param {string} invite_code - 邀请码（可选）
 */
export function register(data) {
  return request({
    url: '/passport/auth/register',
    method: 'post',
    data,
  })
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: '/passport/auth/logout',
    method: 'post',
  })
}
