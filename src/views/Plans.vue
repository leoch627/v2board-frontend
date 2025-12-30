<template>
  <Layout>
    <div class="plans-page">
      <div class="page-header anime-slide-in-top">
        <h1 class="page-title text-gradient-pink">选择你的套餐</h1>
        <p class="page-subtitle">开启你的高速网络之旅 ✨</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <LoadingSpinner text="加载套餐中..." />
      </div>
      
      <!-- Plans Grid -->
      <div v-else class="plans-grid">
        <AnimeCard
          v-for="(plan, index) in plans"
          :key="plan.id"
          class="plan-card anime-slide-in-bottom"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="plan-badge" :class="`gradient-${getPlanColor(index)}`">
            {{ plan.name }}
          </div>
          
          <div class="plan-price">
            <span class="currency">¥</span>
            <span class="amount">{{ formatPrice(plan.month_price) }}</span>
            <span class="period">/月</span>
          </div>
          
          <div class="plan-features">
            <div class="feature-item">
              <el-icon><Connection /></el-icon>
              <span>{{ formatTraffic(plan.transfer_enable, 'gb') }} 流量</span>
            </div>
            <div v-if="plan.speed_limit" class="feature-item">
              <el-icon><Odometer /></el-icon>
              <span>{{ plan.speed_limit }} Mbps</span>
            </div>
            <div class="feature-item">
              <el-icon><Checked /></el-icon>
              <span>{{ plan.content || '高速稳定' }}</span>
            </div>
          </div>
          
          <el-button
            class="buy-button anime-button"
            :class="`anime-button-${getPlanColor(index)}`"
            size="large"
            @click="handleBuyPlan(plan)"
          >
            立即购买
          </el-button>
        </AnimeCard>
      </div>
      
      <!-- Purchase Dialog -->
      <el-dialog
        v-model="showPurchaseDialog"
        title="确认购买"
        width="500px"
        :close-on-click-modal="false"
        custom-class="anime-dialog"
      >
        <div v-if="selectedPlan" class="purchase-content">
          <div class="purchase-summary">
            <h3>{{ selectedPlan.name }}</h3>
            <p class="price-text">
              ¥{{ formatPrice(selectedPlan.month_price) }} / 月
            </p>
          </div>
          
          <el-form :model="purchaseForm" label-width="80px">
            <el-form-item label="购买周期">
              <el-select v-model="purchaseForm.period" class="w-full">
                <el-option label="月付" value="month_price" />
                <el-option label="季付" value="quarter_price" v-if="selectedPlan.quarter_price" />
                <el-option label="半年付" value="half_year_price" v-if="selectedPlan.half_year_price" />
                <el-option label="年付" value="year_price" v-if="selectedPlan.year_price" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="优惠码">
              <el-input v-model="purchaseForm.coupon_code" placeholder="输入优惠码（可选）" />
            </el-form-item>
          </el-form>
          
          <div class="total-price">
            <span>总计：</span>
            <span class="price text-gradient-pink">¥{{ calculateTotalPrice() }}</span>
          </div>
        </div>
        
        <template #footer>
          <el-button @click="showPurchaseDialog = false">取消</el-button>
          <el-button
            type="primary"
            :loading="purchasing"
            @click="handleConfirmPurchase"
            class="anime-button"
          >
            确认购买
          </el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPlanList } from '@/api/plan'
import { createOrder } from '@/api/order'
import { formatTraffic, formatPrice } from '@/utils/helpers'
import { ElMessage } from 'element-plus'
import { Connection, Odometer, Checked } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()

const loading = ref(true)
const plans = ref([])
const showPurchaseDialog = ref(false)
const selectedPlan = ref(null)
const purchasing = ref(false)

const purchaseForm = ref({
  period: 'month_price',
  coupon_code: '',
})

// 获取套餐列表
const fetchPlans = async () => {
  try {
    loading.value = true
    const data = await getPlanList()
    plans.value = data || []
  } catch (error) {
    ElMessage.error('加载套餐失败')
  } finally {
    loading.value = false
  }
}

// 获取套餐颜色
const getPlanColor = (index) => {
  const colors = ['pink', 'purple', 'blue']
  return colors[index % colors.length]
}

// 处理购买套餐
const handleBuyPlan = (plan) => {
  selectedPlan.value = plan
  purchaseForm.value = {
    period: 'month_price',
    coupon_code: '',
  }
  showPurchaseDialog.value = true
}

// 计算总价
const calculateTotalPrice = () => {
  if (!selectedPlan.value) return '0.00'
  const period = purchaseForm.value.period
  const price = selectedPlan.value[period] || selectedPlan.value.month_price
  return formatPrice(price)
}

// 确认购买
const handleConfirmPurchase = async () => {
  try {
    purchasing.value = true
    
    // 创建订单
    const orderData = {
      plan_id: selectedPlan.value.id,
      period: purchaseForm.value.period,
    }
    
    if (purchaseForm.value.coupon_code) {
      orderData.coupon_code = purchaseForm.value.coupon_code
    }
    
    const order = await createOrder(orderData)
    
    ElMessage.success('订单创建成功！')
    
    // 跳转到订单详情便于支付
    showPurchaseDialog.value = false
    const tradeNo = order?.trade_no || order?.data?.trade_no
    if (tradeNo) {
      router.push(`/orders/${tradeNo}`)
    } else {
      router.push('/orders')
    }
    
  } catch (error) {
    console.error('Purchase error:', error)
  } finally {
    purchasing.value = false
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

<style scoped>
.plans-page {
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

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.plan-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
}

.plan-badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 18px;
  align-self: center;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.currency {
  font-size: 24px;
  color: #FF6B9D;
  font-weight: 600;
}

.amount {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6B9D, #C77DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.period {
  font-size: 16px;
  color: #999;
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0;
  border-top: 1px solid rgba(255, 107, 157, 0.1);
  border-bottom: 1px solid rgba(255, 107, 157, 0.1);
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.buy-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.purchase-content {
  padding: 20px 0;
}

.purchase-summary {
  text-align: center;
  margin-bottom: 32px;
}

.purchase-summary h3 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
}

.price-text {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6B9D, #C77DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 107, 157, 0.05);
  border-radius: 12px;
  margin-top: 24px;
  font-size: 18px;
}

.total-price .price {
  font-size: 28px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 32px;
  }
}
</style>
