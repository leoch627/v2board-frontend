import { defineStore } from 'pinia'
import { getUserInfo, getUserStat } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    info: null,
    stat: null,
  }),
  
  getters: {
    // 获取用户邮箱
    email: (state) => state.info?.email || '',
    
    // 获取用户UUID
    uuid: (state) => state.info?.uuid || '',
    
    // 获取用户Token
    token: (state) => state.info?.token || '',
    
    // 套餐名称
    planName: (state) => state.stat?.plan_name || '暂无套餐',
    
    // 已用流量 (GB)
    usedTraffic: (state) => {
      if (!state.stat) return 0
      return ((state.stat.u + state.stat.d) / 1073741824).toFixed(2)
    },
    
    // 总流量 (GB)
    totalTraffic: (state) => {
      if (!state.stat) return 0
      return (state.stat.transfer_enable / 1073741824).toFixed(2)
    },
    
    // 流量使用百分比
    trafficPercent: (state) => {
      if (!state.stat || !state.stat.transfer_enable) return 0
      const used = state.stat.u + state.stat.d
      return Math.min(Math.round((used / state.stat.transfer_enable) * 100), 100)
    },
    
    // 到期时间
    expiredAt: (state) => {
      if (!state.stat || !state.stat.expired_at) return null
      return new Date(state.stat.expired_at * 1000)
    },
    
    // 是否已过期
    isExpired: (state) => {
      if (!state.stat || !state.stat.expired_at) return false
      return Date.now() > state.stat.expired_at * 1000
    },
  },
  
  actions: {
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const data = await getUserInfo()
        this.info = data
        return data
      } catch (error) {
        throw error
      }
    },
    
    // 获取用户统计信息
    async fetchUserStat() {
      try {
        const data = await getUserStat()
        this.stat = data
        return data
      } catch (error) {
        throw error
      }
    },
    
    // 刷新所有用户数据
    async refreshAll() {
      await Promise.all([
        this.fetchUserInfo(),
        this.fetchUserStat(),
      ])
    },
  },
})
