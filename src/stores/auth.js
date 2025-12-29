import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi, logout as logoutApi } from '@/api/auth'
import { getUserInfo } from '@/api/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
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
        // 保存token到状态和localStorage
        this.token = data.token || data.auth_data
        localStorage.setItem('token', this.token)
        
        // 如果有auth_data，也保存到localStorage
        if (data.auth_data) {
          localStorage.setItem('auth_data', data.auth_data)
        }
        
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
        // 保存token到状态和localStorage
        this.token = data.token || data.auth_data
        localStorage.setItem('token', this.token)
        
        // 如果有auth_data，也保存到localStorage
        if (data.auth_data) {
          localStorage.setItem('auth_data', data.auth_data)
        }
        
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
