<template>
  <Layout>
    <div class="subscribe-page">
      <div class="page-header anime-slide-in-top">
        <h1 class="page-title text-gradient-pink">订阅管理</h1>
        <p class="page-subtitle">管理你的订阅链接 ✨</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <LoadingSpinner text="加载订阅信息中..." />
      </div>
      
      <!-- Subscribe Content -->
      <div v-else class="subscribe-content">
        <!-- Subscribe Link Card -->
        <AnimeCard class="subscribe-card anime-slide-in-left">
          <h2 class="card-title">
            <el-icon><Link /></el-icon>
            <span>订阅链接</span>
          </h2>
          
          <div class="subscribe-link-box">
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
          
          <div class="subscribe-actions">
            <el-button class="anime-button" @click="handleReset">
              <el-icon><Refresh /></el-icon>
              <span>重置订阅</span>
            </el-button>
          </div>
        </AnimeCard>
        
        <!-- QR Code Card -->
        <AnimeCard class="qrcode-card anime-slide-in-right">
          <h2 class="card-title">
            <el-icon><PictureRounded /></el-icon>
            <span>订阅二维码</span>
          </h2>
          
          <div class="qrcode-box">
            <canvas ref="qrcodeCanvas" class="qrcode-canvas"></canvas>
          </div>
          
          <p class="qrcode-tip">使用客户端扫描二维码订阅</p>
        </AnimeCard>
        
        <!-- Client Tutorial Card -->
        <AnimeCard class="tutorial-card anime-slide-in-bottom">
          <h2 class="card-title">
            <el-icon><Monitor /></el-icon>
            <span>客户端导入教程</span>
          </h2>
          
          <div class="client-grid">
            <div class="client-item" v-for="client in clients" :key="client.name">
              <div class="client-icon">{{ client.icon }}</div>
              <h3 class="client-name">{{ client.name }}</h3>
              <p class="client-desc">{{ client.desc }}</p>
            </div>
          </div>
        </AnimeCard>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getSubscribe, resetSubscribe } from '@/api/user'
import { copyToClipboard } from '@/utils/helpers'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Link, DocumentCopy, Refresh, PictureRounded, Monitor } from '@element-plus/icons-vue'
import QRCode from 'qrcode'
import Layout from '@/components/Layout.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const loading = ref(true)
const subscribeUrl = ref('')
const qrcodeCanvas = ref(null)

// 客户端列表
const clients = [
  {
    name: 'Clash',
    icon: '⚡',
    desc: '复制订阅链接导入',
  },
  {
    name: 'V2Ray',
    icon: '🚀',
    desc: '支持多种协议',
  },
  {
    name: 'Shadowrocket',
    icon: '🔥',
    desc: 'iOS 平台推荐',
  },
  {
    name: 'Quantumult X',
    icon: '⭐',
    desc: 'iOS 高级客户端',
  },
]

// 获取订阅信息
const fetchSubscribe = async () => {
  try {
    loading.value = true
    const data = await getSubscribe()
    subscribeUrl.value = data.subscribe_url || data.url || ''
    
    // 生成二维码
    await nextTick()
    if (qrcodeCanvas.value && subscribeUrl.value) {
      await generateQRCode()
    }
  } catch (error) {
    ElMessage.error('加载订阅信息失败')
  } finally {
    loading.value = false
  }
}

// 生成二维码
const generateQRCode = async () => {
  try {
    await QRCode.toCanvas(qrcodeCanvas.value, subscribeUrl.value, {
      width: 250,
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

// 复制订阅链接
const handleCopy = async () => {
  const success = await copyToClipboard(subscribeUrl.value)
  if (success) {
    ElMessage({
      message: '复制成功！',
      type: 'success',
      customClass: 'anime-message',
    })
  } else {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 重置订阅
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

onMounted(() => {
  fetchSubscribe()
})
</script>

<style scoped>
.subscribe-page {
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

.subscribe-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.subscribe-link-box {
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

.subscribe-actions {
  display: flex;
  justify-content: center;
}

.qrcode-box {
  display: flex;
  justify-content: center;
  padding: 24px;
  background: white;
  border-radius: 16px;
  margin-bottom: 16px;
}

.qrcode-canvas {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.2);
}

.qrcode-tip {
  text-align: center;
  color: #999;
  font-size: 14px;
}

.client-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.client-item {
  text-align: center;
  padding: 24px;
  background: rgba(255, 107, 157, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.client-item:hover {
  background: rgba(255, 107, 157, 0.1);
  transform: translateY(-3px);
}

.client-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.client-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.client-desc {
  font-size: 14px;
  color: #999;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }
  
  .client-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
