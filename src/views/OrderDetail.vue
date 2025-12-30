<template>
  <Layout>
    <div class="order-detail-page">
      <div class="page-header anime-slide-in-top">
        <el-button @click="$router.back()" class="back-button" circle>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h1 class="page-title text-gradient-pink">订单详情</h1>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <LoadingSpinner text="加载订单详情中..." />
      </div>
      
      <!-- Order Detail -->
      <div v-else-if="order" class="order-detail anime-fade-in-scale">
        <AnimeCard class="detail-card">
          <div class="detail-header">
            <h2>{{ order.plan?.name || '套餐订单' }}</h2>
            <el-tag
              :type="getOrderStatusType(order.status)"
              class="status-tag"
              size="large"
            >
              {{ getOrderStatusText(order.status) }}
            </el-tag>
          </div>
          
          <div class="anime-divider"></div>
          
          <div class="detail-section">
            <h3 class="section-title">订单信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">订单号</span>
                <span class="info-value">{{ order.trade_no }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">创建时间</span>
                <span class="info-value">{{ formatDate(order.created_at * 1000) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">订单金额</span>
                <span class="info-value price-text">¥{{ formatPrice(order.total_amount) }}</span>
              </div>
              <div v-if="order.period" class="info-item">
                <span class="info-label">购买周期</span>
                <span class="info-value">{{ getPeriodText(order.period) }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="order.plan" class="detail-section">
            <h3 class="section-title">套餐信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">套餐名称</span>
                <span class="info-value">{{ order.plan.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">流量</span>
                <span class="info-value">{{ formatTraffic(order.plan.transfer_enable) }}</span>
              </div>
              <div v-if="order.plan.speed_limit" class="info-item">
                <span class="info-label">速度限制</span>
                <span class="info-value">{{ order.plan.speed_limit }} Mbps</span>
              </div>
            </div>
          </div>
          
          <div class="detail-actions">
            <el-button
              v-if="order.status === 0"
              type="primary"
              size="large"
              class="anime-button"
              @click="handlePay"
            >
              立即支付
            </el-button>
            <el-button
              v-if="order.status === 0"
              type="danger"
              size="large"
              plain
              @click="handleCancel"
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
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail, cancelOrder, getPaymentMethods, checkoutOrder } from '@/api/order'
import { formatDate, formatPrice, formatTraffic, getOrderStatusText, getOrderStatusType } from '@/utils/helpers'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const order = ref(null)

// 解析后端返回的跳转链接，优先保持原始编码，避免破坏 query/hash
const resolveRedirectUrl = (res) => {
  const normalize = (value) => {
    if (typeof value !== 'string') return ''
    const trimmed = value.trim()
    return trimmed
  }

  const candidates = [
    res?.data?.url,
    res?.data?.data,
    res?.data,
    res?.url,
    res?.redirect_url,
    res?.redirectUrl,
    res,
  ]

  for (const item of candidates) {
    const resolved = normalize(item)
    if (resolved) return resolved
  }
  return ''
}

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    loading.value = true
    const tradeNo = route.params.id
    const data = await getOrderDetail(tradeNo)
    order.value = data
  } catch (error) {
    ElMessage.error('加载订单详情失败')
    router.back()
  } finally {
    loading.value = false
  }
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
const handlePay = async () => {
  try {
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

    const res = await checkoutOrder({ trade_no: order.value.trade_no, method: selected })
    console.log('checkout response', res)

    if (res?.type === 0 && res?.data) {
      await ElMessageBox.alert(
        `<div style="text-align:center;">
          <p style="margin-bottom:12px;">请使用支付工具扫码</p>
          <img src="${res.data}" style="max-width:260px;" />
        </div>`,
        '扫码支付',
        { dangerouslyUseHTMLString: true, confirmButtonText: '已完成支付' }
      )
      fetchOrderDetail()
      return
    }

    const redirectUrl = resolveRedirectUrl(res)

    if ((res?.type === 1 || redirectUrl) && redirectUrl) {
      const opened = window.open(redirectUrl, '_blank')
      if (!opened) {
        await ElMessageBox.alert(
          `<div style="text-align:left;">
            <p style="margin-bottom:8px;">点击下方按钮跳转支付（如被拦截可右键在新标签打开）：</p>
            <p><a href="${redirectUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:10px 14px;background:#409EFF;color:#fff;border-radius:6px;text-decoration:none;">前往支付</a></p>
            <p style="word-break:break-all;color:#666;font-size:12px;">${redirectUrl}</p>
          </div>`,
          '前往支付',
          { dangerouslyUseHTMLString: true, confirmButtonText: '我已打开支付页' }
        )
      }
      fetchOrderDetail()
      return
    }

    ElMessage.warning(`未获取到支付链接，请重试或联系管理员。响应: ${JSON.stringify(res || {})}`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Payment error:', error)
      ElMessage.error('支付失败，请重试')
    }
  }
}

// 取消订单
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await cancelOrder({ trade_no: order.value.trade_no })
    ElMessage.success('订单已取消')
    router.push('/orders')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Cancel order error:', error)
    }
  }
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail-page {
  padding: 24px 0;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-button {
  background: linear-gradient(135deg, #FF6B9D, #FFA8D5);
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateX(-3px);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.order-detail {
  max-width: 800px;
  margin: 0 auto;
}

.detail-card {
  padding: 40px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.detail-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.status-tag {
  border-radius: 12px;
  padding: 8px 16px;
  font-weight: 600;
}

.detail-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #666;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 107, 157, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: #999;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.price-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6B9D, #C77DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.detail-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 107, 157, 0.1);
}

@media (max-width: 768px) {
  .detail-card {
    padding: 24px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-actions {
    flex-direction: column;
  }
  
  .detail-actions button {
    width: 100%;
  }
}
</style>
