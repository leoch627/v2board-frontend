<template>
  <Layout>
    <div class="orders-page">
      <div class="page-header anime-slide-in-top">
        <h1 class="page-title text-gradient-pink">我的订单</h1>
        <p class="page-subtitle">查看和管理你的订单</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <LoadingSpinner text="加载订单中..." />
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!orders.length" class="empty-state anime-fade-in-scale">
        <AnimeCard>
          <div class="empty-content">
            <div class="empty-icon">📦</div>
            <h3>还没有订单</h3>
            <p>快去选购心仪的套餐吧！</p>
            <el-button class="anime-button" @click="$router.push('/plans')">
              浏览套餐
            </el-button>
          </div>
        </AnimeCard>
      </div>
      
      <!-- Orders Timeline -->
      <div v-else class="orders-timeline">
        <AnimeCard
          v-for="(order, index) in orders"
          :key="order.trade_no"
          class="order-card anime-slide-in-left"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="order-header">
            <div class="order-info">
              <h3 class="order-title">{{ order.plan?.name || '套餐订单' }}</h3>
              <p class="order-no">订单号: {{ order.trade_no }}</p>
            </div>
            <div class="order-status">
              <el-tag
                :type="getOrderStatusType(order.status)"
                class="status-tag"
                size="large"
              >
                {{ getOrderStatusText(order.status) }}
              </el-tag>
            </div>
          </div>
          
          <div class="order-divider"></div>
          
          <div class="order-details">
            <div class="detail-row">
              <span class="label">创建时间：</span>
              <span class="value">{{ formatDate(order.created_at * 1000) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">订单金额：</span>
              <span class="value price-value">¥{{ formatPrice(order.total_amount) }}</span>
            </div>
            <div v-if="order.period" class="detail-row">
              <span class="label">购买周期：</span>
              <span class="value">{{ getPeriodText(order.period) }}</span>
            </div>
          </div>
          
          <div class="order-actions">
            <el-button
              size="small"
              @click="viewOrderDetail(order.trade_no)"
            >
              查看详情
            </el-button>
            <el-button
              v-if="order.status === 0"
              type="primary"
              size="small"
              class="anime-button"
              @click="handlePay(order)"
            >
              立即支付
            </el-button>
            <el-button
              v-if="order.status === 0"
              type="danger"
              size="small"
              plain
              @click="handleCancel(order.trade_no)"
            >
              取消订单
            </el-button>
          </div>
        </AnimeCard>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderList, cancelOrder, getPaymentMethods, checkoutOrder } from '@/api/order'
import { formatDate, formatPrice, getOrderStatusText, getOrderStatusType } from '@/utils/helpers'
import { ElMessage, ElMessageBox } from 'element-plus'
import Layout from '@/components/Layout.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()

const loading = ref(true)
const orders = ref([])
const paying = ref(false)

// 获取订单列表
const fetchOrders = async () => {
  try {
    loading.value = true
    const data = await getOrderList()
    orders.value = data || []
  } catch (error) {
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

// 查看订单详情
const viewOrderDetail = (tradeNo) => {
  router.push(`/orders/${tradeNo}`)
}

// 获取周期文本
const getPeriodText = (period) => {
  const periodMap = {
    month_price: '月付',
    quarter_price: '季付',
    half_year_price: '半年付',
    year_price: '年付',
    two_year_price: '两年付',
    three_year_price: '三年付',
  }
  return periodMap[period] || period
}

// 处理支付
const handlePay = async (order) => {
  try {
    paying.value = true
    const methods = await getPaymentMethods()
    if (!methods || methods.length === 0) {
      ElMessage.warning('暂无可用的支付方式')
      return
    }

    let selected = methods[0]?.id
    const options = methods.map((m) => {
      const name = String(m.name)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
      return `<label style="display:block;margin:10px 0;">
        <input type="radio" name="payment" value="${m.id}" ${m.id === selected ? 'checked' : ''}>
        ${name}
      </label>`
    }).join('')

    await ElMessageBox.confirm(
      `<div style="text-align:left;">
        <p style="margin-bottom:12px;">请选择支付方式：</p>
        <form id="payment-form">${options}</form>
      </div>`,
      '选择支付方式',
      {
        confirmButtonText: '确认支付',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const radio = document.querySelector('input[name="payment"]:checked')
            if (radio) {
              selected = parseInt(radio.value)
            }
          }
          done()
        },
      }
    )

    if (!selected) {
      ElMessage.error('请选择支付方式')
      return
    }

    const res = await checkoutOrder({ trade_no: order.trade_no, method: selected })

    // 支付结果分支
    if (res?.type === 0) {
      // 二维码
      await ElMessageBox.alert(
        `<div style="text-align:center;">
          <p style="margin-bottom:12px;">请使用支付工具扫码</p>
          <img src="${res.data}" style="max-width:260px;" />
        </div>`,
        '扫码支付',
        { dangerouslyUseHTMLString: true, confirmButtonText: '已完成支付' }
      )
      fetchOrders()
      return
    }

    // 跳转支付（兼容后端返回 data/url/redirect_url 等字段）
    const redirectUrl = res?.data?.url || res?.data || res?.url || res?.redirect_url
    if (res?.type === 1 || redirectUrl) {
      if (redirectUrl) {
        await ElMessageBox.alert(
          `<div style="text-align:left;">
            <p style="margin-bottom:8px;">点击下方按钮跳转支付（如被拦截可右键在新标签打开）：</p>
            <p><a href="${redirectUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:10px 14px;background:#409EFF;color:#fff;border-radius:6px;text-decoration:none;">前往支付</a></p>
            <p style="word-break:break-all;color:#666;font-size:12px;">${redirectUrl}</p>
          </div>`,
          '前往支付',
          { dangerouslyUseHTMLString: true, confirmButtonText: '我已打开支付页' }
        )
        fetchOrders()
        return
      }
    }

    ElMessage.success('支付请求已提交')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Payment error:', error)
      ElMessage.error('支付失败，请重试')
    }
  } finally {
    paying.value = false
  }
}

// 取消订单
const handleCancel = async (tradeNo) => {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await cancelOrder({ trade_no: tradeNo })
    ElMessage.success('订单已取消')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Cancel order error:', error)
    }
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-page {
  padding: 24px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.empty-state {
  max-width: 500px;
  margin: 80px auto;
}

.empty-content {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

.empty-content h3 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #333;
}

.empty-content p {
  color: #999;
  margin-bottom: 32px;
}

.orders-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.order-card {
  transition: all 0.3s ease;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.order-info {
  flex: 1;
}

.order-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.order-no {
  font-size: 14px;
  color: #999;
}

.order-status {
  margin-left: 16px;
}

.status-tag {
  border-radius: 12px;
  padding: 8px 16px;
  font-weight: 600;
}

.order-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 107, 157, 0.2), transparent);
  margin: 20px 0;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.detail-row .label {
  color: #999;
}

.detail-row .value {
  color: #333;
  font-weight: 500;
}

.price-value {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6B9D, #C77DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.order-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }
  
  .order-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .order-status {
    margin-left: 0;
  }
  
  .order-actions {
    flex-wrap: wrap;
    justify-content: stretch;
  }
  
  .order-actions button {
    flex: 1;
  }
}
</style>
