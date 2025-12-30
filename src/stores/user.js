import { defineStore } from 'pinia'
import { getUserInfo, getUserStat, getSubscribe } from '@/api/user'
import { formatTraffic } from '@/utils/helpers'

export const useUserStore = defineStore('user', {
  state: () => ({
    info: null,
    stat: null,
    subscribe: null,
  }),
  
  getters: {
    // 获取用户邮箱
    email: (state) => state.info?.email || '',
    
    // 获取用户UUID
    uuid: (state) => state.info?.uuid || '',
    
    // 获取用户Token
    token: (state) => state.info?.token || '',
    
    // 套餐ID
    planId: (state) => state.subscribe?.plan_id || state.info?.plan_id || null,
    
    // 套餐名称
    planName: (state) => state.stat?.plan_name || state.subscribe?.plan?.name || state.info?.plan_name || '暂无套餐',
    
    // 已用流量（格式化为GB/TB）
    usedTraffic: (state) => {
      const source = state.subscribe || state.info
      if (!source) return '0 GB'
      const used = (source.u || 0) + (source.d || 0)
      return formatTraffic(used, 'bytes') // 后端返回 bytes，避免二次放大
    },
    
    // 总流量（格式化为GB/TB）
    totalTraffic: (state) => {
      const total = state.subscribe?.transfer_enable || state.info?.transfer_enable
      if (!total) return '0 GB'
      return formatTraffic(total, 'bytes') // 后端返回 bytes，避免二次放大
    },
    
    // 流量使用百分比
    trafficPercent: (state) => {
      const source = state.subscribe || state.info
      const total = state.subscribe?.transfer_enable || state.info?.transfer_enable
      if (!source || !total) return 0
      const used = (source.u || 0) + (source.d || 0)
      return Math.min(Math.round((used / total) * 100), 100)
    },
    
    // 到期时间
    expiredAt: (state) => {
      const expired = state.subscribe?.expired_at ?? state.info?.expired_at
      if (!expired) return null
      return new Date(expired * 1000)
    },
    
    // 是否已过期
    isExpired: (state) => {
      const expired = state.subscribe?.expired_at ?? state.info?.expired_at
      if (!expired) return false
      return Date.now() > expired * 1000
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

    // 获取订阅信息（包含可用流量、plan 等）
    async fetchSubscribe() {
      try {
        const data = await getSubscribe()
        this.subscribe = data
        return data
      } catch (error) {
        throw error
      }
    },
    
    // 刷新所有用户数据
    async refreshAll() {
      // 先获取用户信息，因为它包含了主要数据
      await this.fetchUserInfo()

      // 获取订阅信息（包含最新的 transfer_enable、plan）
      try {
        await this.fetchSubscribe()
      } catch (error) {
        console.log('getSubscribe API not available')
      }

      // 获取统计信息（如果API存在的话）
      try {
        await this.fetchUserStat()
      } catch (error) {
        // 如果getStat API不存在或失败，继续使用已有数据
        console.log('getStat API not available, using info/subscribe data')
      }
    },
  },
})
