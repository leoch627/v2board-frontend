import { defineStore } from 'pinia'
import { getUserInfo, getUserStat } from '@/api/user'
import { formatTraffic } from '@/utils/helpers'

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
    
    // 套餐ID
    planId: (state) => state.info?.plan_id || null,
    
    // 套餐名称
    planName: (state) => state.stat?.plan_name || state.info?.plan_name || '暂无套餐',
    
    // 已用流量（格式化为GB/TB）
    usedTraffic: (state) => {
      if (!state.info) return '0 GB'
      const used = (state.info.u || 0) + (state.info.d || 0)
      return formatTraffic(used)
    },
    
    // 总流量（格式化为GB/TB）
    totalTraffic: (state) => {
      if (!state.info || !state.info.transfer_enable) return '0 GB'
      return formatTraffic(state.info.transfer_enable)
    },
    
    // 流量使用百分比
    trafficPercent: (state) => {
      if (!state.info || !state.info.transfer_enable) return 0
      const used = (state.info.u || 0) + (state.info.d || 0)
      return Math.min(Math.round((used / state.info.transfer_enable) * 100), 100)
    },
    
    // 到期时间
    expiredAt: (state) => {
      if (!state.info || !state.info.expired_at) return null
      return new Date(state.info.expired_at * 1000)
    },
    
    // 是否已过期
    isExpired: (state) => {
      if (!state.info || !state.info.expired_at) return false
      return Date.now() > state.info.expired_at * 1000
    },
  },
  
  actions: {
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const data = await getUserInfo()
        // 存储用户信息，API返回的数据已经包含所有信息
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
      // 先获取用户信息，因为它包含了主要数据
      await this.fetchUserInfo()
      // 获取统计信息（如果API存在的话）
      try {
        await this.fetchUserStat()
      } catch (error) {
        // 如果getStat API不存在或失败，继续使用info中的数据
        console.log('getStat API not available, using info data')
      }
    },
  },
})
