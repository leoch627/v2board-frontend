import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi, logout as logoutApi } from '@/api/auth'
import { getUserInfo } from '@/api/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_data') || localStorage.getItem('token') || '',
    user: null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  
  actions: {
    // 登录
    async login(credentials) {
      try {
        const data = await loginApi(credentials)
        // 优先使用auth_data作为token
        this.token = data.auth_data || data.token
        localStorage.setItem('auth_data', this.token)
        
        // 为了向后兼容，也保存到token
        localStorage.setItem('token', this.token)
        
        await this.fetchUserInfo()
        return data
      } catch (error) {
        throw error
      }
    },
    
    // 注册
    async register(userData) {
      try {
        const data = await registerApi(userData)
        // 优先使用auth_data作为token
        this.token = data.auth_data || data.token
        localStorage.setItem('auth_data', this.token)
        
        // 为了向后兼容，也保存到token
        localStorage.setItem('token', this.token)
        
        await this.fetchUserInfo()
        return data
      } catch (error) {
        throw error
      }
    },
    
    // 退出登录
    async logout() {
      try {
        await logoutApi()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.token = ''
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('auth_data')
      }
    },
    
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const data = await getUserInfo()
        this.user = data
        return data
      } catch (error) {
        throw error
      }
    },
  },
})
