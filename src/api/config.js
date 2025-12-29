import request from './request'

/**
 * 获取服务器配置
 */
export function getConfig() {
  return request({
    url: '/passport/comm/config',
    method: 'get',
  })
}

/**
 * 发送邮箱验证码
 * @param {string} email - 邮箱地址
 */
export function sendEmailVerify(data) {
  return request({
    url: '/passport/comm/sendEmailVerify',
    method: 'post',
    data,
  })
}
