<template>
  <Layout>
    <div class="dashboard-page">
      <!-- Page Header -->
      <div class="page-header anime-slide-in-top">
        <h1 class="page-title text-gradient-pink">欢迎回来！</h1>
        <p class="page-subtitle">{{ userGreeting }} ✨</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <LoadingSpinner text="加载中..." />
      </div>

      <!-- Dashboard Content -->
      <div v-else class="dashboard-content">
        <!-- No Plan - Show Plans Purchase Section -->
        <div v-if="!hasPlan" class="no-plan-section">
          <AnimeCard class="no-plan-card anime-slide-in-top">
            <div class="no-plan-content">
              <div class="no-plan-icon">📦</div>
              <h2 class="no-plan-title">您还没有购买套餐</h2>
              <p class="no-plan-desc">购买套餐后即可开始使用我们的服务</p>
              <router-link to="/plans">
                <el-button type="primary" size="large" class="anime-button">
                  <el-icon><ShoppingCart /></el-icon>
                  <span>立即购买套餐</span>
                </el-button>
              </router-link>
            </div>
          </AnimeCard>

          <!-- Plans Preview -->
          <div class="plans-preview">
            <h2 class="preview-title">推荐套餐</h2>
            <div v-if="loadingPlans" class="loading-container">
              <LoadingSpinner text="加载套餐中..." />
            </div>
            <div v-else class="plans-preview-grid">
              <AnimeCard
                v-for="(plan, index) in previewPlans"
                :key="plan.id"
                class="preview-plan-card anime-slide-in-bottom"
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
                    <span>{{ formatBytes(plan.transfer_enable) }} 流量</span>
                  </div>
                  <div v-if="plan.speed_limit" class="feature-item">
                    <el-icon><Odometer /></el-icon>
                    <span>{{ plan.speed_limit }} Mbps</span>
                  </div>
                </div>
                
                <router-link to="/plans">
                  <el-button
                    class="buy-button anime-button"
                    :class="`anime-button-${getPlanColor(index)}`"
                    size="large"
                  >
                    立即购买
                  </el-button>
                </router-link>
              </AnimeCard>
            </div>
          </div>
        </div>

        <!-- Has Plan - Show Subscription Features -->
        <template v-else>
        <!-- User Info & Stats Card -->
        <AnimeCard class="info-stats-card anime-slide-in-left">
          <h2 class="card-title">
            <el-icon><User /></el-icon>
            <span>账户概览</span>
          </h2>
          
          <div class="info-stats-grid">
            <!-- User Info Section -->
            <div class="info-section">
              <div class="info-item">
                <span class="info-label">邮箱</span>
                <span class="info-value">{{ userStore.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">套餐</span>
                <span class="info-value">{{ planName }}</span>
              </div>
            </div>

            <!-- Traffic Stats -->
            <div class="stats-section">
              <div class="traffic-display">
                <div class="traffic-item">
                  <span class="traffic-label">已用流量</span>
                  <span class="traffic-value">{{ userStore.usedTraffic }}</span>
                </div>
                <div class="traffic-divider">/</div>
                <div class="traffic-item">
                  <span class="traffic-label">总流量</span>
                  <span class="traffic-value">{{ userStore.totalTraffic }}</span>
                </div>
              </div>
              <el-progress 
                :percentage="userStore.trafficPercent" 
                :color="progressColor"
                :stroke-width="12"
              />
              <div class="expire-info">
                <span class="expire-label">到期时间:</span>
                <span class="expire-value" :class="{ expired: userStore.isExpired }">
                  {{ expiredText }}
                </span>
              </div>
            </div>
          </div>
        </AnimeCard>

        <!-- Subscription Card -->
        <AnimeCard class="subscription-card anime-slide-in-right">
          <h2 class="card-title">
            <el-icon><Link /></el-icon>
            <span>订阅管理</span>
          </h2>

          <!-- Subscription URL -->
          <div class="subscription-url-section">
            <label class="section-label">订阅地址</label>
            <el-input
              v-model="subscribeUrl"
              readonly
              class="subscribe-input"
            >
              <template #append>
                <el-button @click="handleCopy" class="copy-btn">
                  <el-icon><DocumentCopy /></el-icon>
                  <span>复制</span>
                </el-button>
              </template>
            </el-input>
          </div>

          <!-- QR Code -->
          <div class="qrcode-section">
            <label class="section-label">扫码订阅</label>
            <div class="qrcode-box">
              <canvas 
                ref="qrcodeCanvas" 
                class="qrcode-canvas"
                role="img"
                :aria-label="`订阅地址二维码: ${subscribeUrl}`"
              ></canvas>
            </div>
          </div>

          <!-- Import Buttons -->
          <div class="import-section">
            <label class="section-label">一键导入</label>
            
            <!-- Desktop/Tablet Clients -->
            <div v-if="!isMobile" class="client-buttons desktop-clients">
              <el-button 
                v-for="client in desktopClients" 
                :key="client.name"
                class="client-button anime-button"
                @click="handleImport(client)"
              >
                <span class="client-icon">{{ client.icon }}</span>
                <span>{{ client.name }}</span>
              </el-button>
            </div>

            <!-- Mobile Clients -->
            <div v-else class="client-buttons mobile-clients">
              <el-button 
                v-for="client in mobileClients" 
                :key="client.name"
                class="client-button anime-button"
                @click="handleImport(client)"
              >
                <span class="client-icon">{{ client.icon }}</span>
                <span>{{ client.name }}</span>
              </el-button>
            </div>
          </div>

          <!-- Reset Subscription -->
          <div class="reset-section">
            <el-button 
              class="reset-button" 
              @click="handleReset"
              :icon="Refresh"
            >
              重置订阅
            </el-button>
          </div>
        </AnimeCard>

        <!-- Quick Actions Card -->
        <AnimeCard class="quick-actions-card anime-slide-in-bottom">
          <h2 class="card-title">
            <el-icon><Menu /></el-icon>
            <span>快捷操作</span>
          </h2>
          
          <div class="action-grid">
            <router-link to="/plans" class="action-item anime-hover-lift">
              <div class="action-icon">🛒</div>
              <div class="action-text">购买套餐</div>
            </router-link>
            <router-link to="/orders" class="action-item anime-hover-lift">
              <div class="action-icon">📄</div>
              <div class="action-text">我的订单</div>
            </router-link>
            <router-link to="/profile" class="action-item anime-hover-lift">
              <div class="action-icon">👤</div>
              <div class="action-text">个人中心</div>
            </router-link>
            <a href="#" @click.prevent="handleDownloadClients" class="action-item anime-hover-lift">
              <div class="action-icon">📱</div>
              <div class="action-text">客户端下载</div>
            </a>
          </div>
        </AnimeCard>
        </template>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { getSubscribe, resetSubscribe } from '@/api/user'
import { getPlanList } from '@/api/plan'
import { copyToClipboard, formatDate, formatBytes, formatPrice, isMobileDevice } from '@/utils/helpers'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  User, Link, DocumentCopy, Refresh, Menu, PictureRounded, ShoppingCart, Connection, Odometer
} from '@element-plus/icons-vue'
import QRCode from 'qrcode'
import Layout from '@/components/Layout.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const userStore = useUserStore()

const loading = ref(true)
const loadingPlans = ref(false)
const subscribeUrl = ref('')
const qrcodeCanvas = ref(null)
const isMobile = ref(false)
const plans = ref([])

// Check if user has a plan
const hasPlan = computed(() => {
  return userStore.info?.plan_id && userStore.info.plan_id > 0
})

// Preview plans (show first 3)
const previewPlans = computed(() => {
  return plans.value.slice(0, 3)
})

// Desktop/Tablet clients
const desktopClients = [
  {
    name: 'Clash',
    icon: '⚡',
    scheme: 'clash://install-config?url=',
    urlScheme: true
  },
  {
    name: 'Clash Verge',
    icon: '🌟',
    scheme: 'clash-verge://install-config?url=',
    urlScheme: true
  },
  {
    name: 'Mihomo Party',
    icon: '🎉',
    scheme: 'mihomo://install-config?url=',
    urlScheme: true
  },
  {
    name: 'V2rayN',
    icon: '🚀',
    scheme: null,
    manual: true
  }
]

// Mobile clients
const mobileClients = [
  {
    name: 'Shadowrocket',
    icon: '🔥',
    scheme: 'shadowrocket://add/sub://',
    needsEncode: true
  },
  {
    name: 'Loon',
    icon: '🎈',
    scheme: 'loon://import?sub=',
    needsEncode: false
  },
  {
    name: 'Hiddify',
    icon: '🔐',
    scheme: 'hiddify://import/',
    needsEncode: false
  },
  {
    name: 'Clash Meta',
    icon: '⚡',
    scheme: 'clash://install-config?url=',
    needsEncode: false
  }
]

// User greeting
const userGreeting = computed(() => {
  const email = userStore.email
  if (email) {
    return email.split('@')[0]
  }
  return '用户'
})

// Plan name
const planName = computed(() => {
  return userStore.stat?.plan_name || userStore.info?.plan_name || '暂无套餐'
})

// Progress color
const progressColor = computed(() => {
  const percent = userStore.trafficPercent
  if (percent >= 90) return '#f56c6c'
  if (percent >= 70) return '#e6a23c'
  return '#FF6B9D'
})

// Expired text
const expiredText = computed(() => {
  if (!userStore.expiredAt) return '未知'
  if (userStore.isExpired) return '已过期'
  return formatDate(userStore.expiredAt)
})

// Fetch subscribe info
const fetchSubscribe = async () => {
  try {
    const data = await getSubscribe()
    subscribeUrl.value = data.subscribe_url || data.url || ''
    
    // Generate QR code
    await nextTick()
    if (qrcodeCanvas.value && subscribeUrl.value) {
      await generateQRCode()
    }
  } catch (error) {
    console.error('Fetch subscribe error:', error)
    ElMessage.error('加载订阅信息失败')
  }
}

// Fetch plans
const fetchPlans = async () => {
  try {
    loadingPlans.value = true
    const data = await getPlanList()
    plans.value = data || []
  } catch (error) {
    console.error('Fetch plans error:', error)
  } finally {
    loadingPlans.value = false
  }
}

// Get plan color
const getPlanColor = (index) => {
  const colors = ['pink', 'purple', 'blue']
  return colors[index % colors.length]
}

// Generate QR code
const generateQRCode = async () => {
  try {
    await QRCode.toCanvas(qrcodeCanvas.value, subscribeUrl.value, {
      width: 200,
      margin: 2,
      color: {
        dark: '#FF6B9D',
        light: '#FFFFFF',
      },
    })
  } catch (error) {
    console.error('Generate QR code error:', error)
  }
}

// Handle copy
const handleCopy = async () => {
  const success = await copyToClipboard(subscribeUrl.value)
  if (success) {
    ElMessage({
      message: '订阅地址已复制！',
      type: 'success',
      customClass: 'anime-message',
    })
  } else {
    ElMessage.error('复制失败，请手动复制')
  }
}

// Handle import
const handleImport = (client) => {
  if (!subscribeUrl.value) {
    ElMessage.warning('订阅地址不存在')
    return
  }

  if (client.manual) {
    ElMessage.info(`请手动复制订阅地址到 ${client.name} 客户端`)
    return
  }

  let importUrl = ''
  
  if (client.needsEncode) {
    // Encode the URL in base64 for clients that require it
    const encodedUrl = btoa(subscribeUrl.value)
    importUrl = client.scheme + encodedUrl
  } else if (client.urlScheme) {
    importUrl = client.scheme + encodeURIComponent(subscribeUrl.value)
  } else {
    importUrl = client.scheme + subscribeUrl.value
  }

  // Try to open the URL scheme
  window.location.href = importUrl
  
  ElMessage({
    message: `正在打开 ${client.name}...`,
    type: 'info',
  })
}

// Handle reset
const handleReset = async () => {
  try {
    await ElMessageBox.confirm(
      '重置订阅后，旧的订阅链接将失效，确定要重置吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await resetSubscribe()
    ElMessage.success('订阅已重置')
    await fetchSubscribe()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Reset subscribe error:', error)
    }
  }
}

// Handle download clients
const handleDownloadClients = () => {
  ElMessageBox.alert(
    '请访问各客户端官网下载：<br>' +
    '• Clash for Windows: clashforwindows.org<br>' +
    '• V2rayN: github.com/2dust/v2rayN<br>' +
    '• Shadowrocket: App Store<br>' +
    '• Loon: App Store<br>' +
    '• Hiddify: hiddify.com',
    '客户端下载',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '知道了'
    }
  )
}

onMounted(async () => {
  try {
    loading.value = true
    
    // Detect mobile
    isMobile.value = isMobileDevice()
    
    // Fetch user data first
    await userStore.refreshAll()
    
    // Check if user has a plan
    if (hasPlan.value) {
      // User has plan, fetch subscription info
      await fetchSubscribe()
    } else {
      // User has no plan, fetch plans to display
      await fetchPlans()
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard-page {
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
  font-size: 18px;
  color: #666;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

/* No Plan Section */
.no-plan-section {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.no-plan-card {
  text-align: center;
}

.no-plan-content {
  padding: 48px 24px;
}

.no-plan-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.no-plan-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.no-plan-desc {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

/* Plans Preview */
.plans-preview {
  text-align: center;
}

.preview-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6B9D, #C77DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 32px;
}

.plans-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.preview-plan-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
}

.plan-badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  align-self: center;
}

.gradient-pink {
  background: linear-gradient(135deg, #FF6B9D, #FFA8D5);
}

.gradient-purple {
  background: linear-gradient(135deg, #C77DFF, #E0B0FF);
}

.gradient-blue {
  background: linear-gradient(135deg, #89CFF0, #A0D8F1);
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.currency {
  font-size: 20px;
  color: #FF6B9D;
  font-weight: 600;
}

.amount {
  font-size: 40px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6B9D, #C77DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.period {
  font-size: 14px;
  color: #999;
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
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
  height: 44px;
  font-size: 15px;
  font-weight: 600;
}

.anime-button-pink {
  background: linear-gradient(135deg, #FF6B9D, #FFA8D5);
  border: none;
  color: white;
}

.anime-button-purple {
  background: linear-gradient(135deg, #C77DFF, #E0B0FF);
  border: none;
  color: white;
}

.anime-button-blue {
  background: linear-gradient(135deg, #89CFF0, #A0D8F1);
  border: none;
  color: white;
}

/* Has Plan Section */

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

/* Info & Stats Card */
.info-stats-card {
  grid-column: 1 / 2;
}

.info-stats-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 107, 157, 0.05);
  border-radius: 12px;
}

.info-label {
  color: #999;
  font-size: 14px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.traffic-display {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 107, 157, 0.05);
  border-radius: 12px;
}

.traffic-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.traffic-label {
  font-size: 12px;
  color: #999;
}

.traffic-value {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6B9D, #C77DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.traffic-divider {
  font-size: 24px;
  color: #ddd;
  font-weight: 300;
}

.expire-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 107, 157, 0.05);
  border-radius: 12px;
  font-size: 14px;
}

.expire-label {
  color: #999;
}

.expire-value {
  font-weight: 600;
  color: #333;
}

.expire-value.expired {
  color: #f56c6c;
}

/* Subscription Card */
.subscription-card {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
}

.subscription-url-section {
  margin-bottom: 24px;
}

.subscribe-input {
  font-size: 14px;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #FF6B9D, #FFA8D5);
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: linear-gradient(135deg, #FFA8D5, #FF6B9D);
}

.qrcode-section {
  margin-bottom: 24px;
}

.qrcode-box {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.qrcode-canvas {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.2);
}

.import-section {
  margin-bottom: 24px;
}

.client-buttons {
  display: grid;
  gap: 12px;
}

.desktop-clients {
  grid-template-columns: repeat(2, 1fr);
}

.mobile-clients {
  grid-template-columns: repeat(2, 1fr);
}

.client-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  font-weight: 600;
}

.client-icon {
  font-size: 20px;
}

.reset-section {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 107, 157, 0.1);
}

.reset-button {
  width: 100%;
}

/* Quick Actions Card */
.quick-actions-card {
  grid-column: 1 / 2;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: rgba(255, 107, 157, 0.05);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-item:hover {
  background: rgba(255, 107, 157, 0.1);
  transform: translateY(-3px);
}

.action-icon {
  font-size: 32px;
}

.action-text {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .info-stats-card,
  .subscription-card,
  .quick-actions-card {
    grid-column: 1 / 2;
  }
  
  .subscription-card {
    grid-row: auto;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .dashboard-content {
    gap: 24px;
  }
  
  .client-buttons {
    grid-template-columns: 1fr;
  }
  
  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
