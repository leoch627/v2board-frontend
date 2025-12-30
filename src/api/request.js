import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 auth_data
    const authData = localStorage.getItem('auth_data')
    if (authData) {
      config.headers.Authorization = authData
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 如果返回的状态码不是 200，则判断为错误
    if (res.code !== undefined && res.code !== 200) {
      // 显示可爱的错误提示
      // Token 过期或未授权，跳转到登录页，避免多次提示
      if (res.code === 401 || res.code === 403) {
        localStorage.removeItem('token')
        localStorage.removeItem('auth_data')
        if (router.currentRoute.value.path !== '/login') {
          router.push({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath },
          })
        }
      }

      // 非授权错误再提示，避免重复弹窗
      if (res.code !== 401 && res.code !== 403) {
        ElMessage({
          message: res.message || '请求失败',
          type: 'error',
          duration: 3000,
          customClass: 'anime-message-error',
        })
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res.data
  },
  (error) => {
    console.error('Response error:', error)
    
    let message = '网络错误，请稍后重试'
    
    if (error.response) {
      // 优先使用后端返回的错误消息（通常是中文）
      if (error.response.data?.message) {
        message = error.response.data.message
      } else {
        // 如果没有后端消息，使用状态码映射
        switch (error.response.status) {
          case 401:
            message = '未授权，请重新登录'
            localStorage.removeItem('token')
            localStorage.removeItem('auth_data')
            router.push('/login')
            break
          case 403:
            message = '拒绝访问'
            break
          case 404:
            message = '请求的资源不存在'
            break
          case 500:
            message = '服务器错误'
            break
        }
      }
      
      // 如果是401或403，清理token并跳转
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('token')
        localStorage.removeItem('auth_data')
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login')
        }
      }
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 3000,
      customClass: 'anime-message-error',
    })
    
    return Promise.reject(error)
  }
)

export default request
