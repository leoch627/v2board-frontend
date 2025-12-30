/**
 * 格式化字节为可读格式
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 格式化日期
 * @param {Date|number|string} date - 日期对象、时间戳或日期字符串
 * @param {string} format - 格式化模板
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 计算剩余天数
 * @param {Date|number} expireDate - 过期日期
 */
export function getRemainingDays(expireDate) {
  const now = new Date()
  const expire = new Date(expireDate)
  const diffTime = expire - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      textArea.remove()
      return successful
    }
  } catch (error) {
    console.error('Copy failed:', error)
    return false
  }
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 */
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 格式化价格
 * @param {number} price - 价格（分）
 */
export function formatPrice(price) {
  return (price / 100).toFixed(2)
}

/**
 * 获取订单状态文本
 * @param {number} status - 订单状态
 */
export function getOrderStatusText(status) {
  const statusMap = {
    0: '待支付',
    1: '已开通',
    2: '已取消',
    3: '已完成',
    4: '已折抵',
  }
  return statusMap[status] || '未知'
}

/**
 * 获取订单状态类型（用于徽章颜色）
 * @param {number} status - 订单状态
 */
export function getOrderStatusType(status) {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'success',
    4: 'info',
  }
  return typeMap[status] || 'info'
}

/**
 * 检测是否为移动设备
 */
export function isMobileDevice() {
  // Check user agent
  const userAgent = navigator.userAgent || navigator.vendor || ''
  
  // Mobile regex patterns
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  
  // Check screen size as well
  const isMobileScreen = window.innerWidth <= 768
  
  return mobileRegex.test(userAgent.toLowerCase()) || isMobileScreen
}

/**
 * 格式化流量显示（GB/TB单位）
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数
 */
export function formatTraffic(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 GB'
  
  const GB = 1073741824 // 1024^3
  const gb = bytes / GB
  
  // 如果大于1024GB，使用TB单位
  if (gb > 1024) {
    const tb = gb / 1024
    return tb.toFixed(decimals) + ' TB'
  }
  
  return gb.toFixed(decimals) + ' GB'
}
