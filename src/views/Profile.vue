<template>
  <Layout>
    <div class="profile-page">
      <div class="page-header anime-slide-in-top">
        <h1 class="page-title text-gradient-pink">个人中心</h1>
        <p class="page-subtitle">管理你的账户信息 ✨</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <LoadingSpinner text="加载用户信息中..." />
      </div>
      
      <!-- Profile Content -->
      <div v-else class="profile-content">
        <!-- User Stats Card -->
        <AnimeCard class="stats-card anime-slide-in-left">
          <h2 class="card-title">
            <el-icon><DataAnalysis /></el-icon>
            <span>使用统计</span>
          </h2>
          
          <div class="traffic-info">
            <div class="traffic-chart">
              <div class="progress-circle">
                <svg viewBox="0 0 100 100">
                  <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
                  <circle
                    class="progress-bar"
                    cx="50"
                    cy="50"
                    r="45"
                    :style="{ strokeDashoffset: progressOffset }"
                  ></circle>
                </svg>
                <div class="progress-text">
                  <span class="percent">{{ userStore.trafficPercent }}%</span>
                  <span class="label">已使用</span>
                </div>
              </div>
            </div>
            
            <div class="traffic-details">
              <div class="detail-item">
                <span class="detail-label">已用流量</span>
                <span class="detail-value">{{ userStore.usedTraffic }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">总流量</span>
                <span class="detail-value">{{ userStore.totalTraffic }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">到期时间</span>
                <span class="detail-value" :class="{ expired: userStore.isExpired }">
                  {{ expiredText }}
                </span>
              </div>
              <div v-if="!userStore.isExpired" class="detail-item">
                <span class="detail-label">剩余天数</span>
                <span class="detail-value highlight">{{ remainingDays }} 天</span>
              </div>
            </div>
          </div>
        </AnimeCard>
        
        <!-- User Info Card -->
        <AnimeCard class="info-card anime-slide-in-right">
          <h2 class="card-title">
            <el-icon><User /></el-icon>
            <span>账户信息</span>
          </h2>
          
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">邮箱</span>
              <span class="info-value">{{ userStore.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">UUID</span>
              <span class="info-value">{{ userStore.uuid }}</span>
            </div>
            <div class="info-actions">
              <el-button 
                type="primary" 
                plain 
                :loading="resettingSubscribe"
                @click="handleResetSubscribe"
              >
                重置订阅地址
              </el-button>
            </div>
          </div>
        </AnimeCard>
        
        <!-- Change Password Card -->
        <AnimeCard class="password-card anime-slide-in-bottom">
          <h2 class="card-title">
            <el-icon><Lock /></el-icon>
            <span>修改密码</span>
          </h2>
          
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
          >
            <el-form-item label="旧密码" prop="old_password">
              <el-input
                v-model="passwordForm.old_password"
                type="password"
                placeholder="请输入旧密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="新密码" prop="new_password">
              <el-input
                v-model="passwordForm.new_password"
                type="password"
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirm_password">
              <el-input
                v-model="passwordForm.confirm_password"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button
                type="primary"
                :loading="changingPassword"
                class="anime-button"
                @click="handleChangePassword"
              >
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </AnimeCard>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { changePassword, resetSubscribe } from '@/api/user'
import { formatDate, getRemainingDays } from '@/utils/helpers'
import { ElMessage } from 'element-plus'
import { DataAnalysis, User, Lock } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const userStore = useUserStore()

const loading = ref(true)
const changingPassword = ref(false)
const passwordFormRef = ref(null)
const resettingSubscribe = ref(false)

const passwordForm = ref({
  old_password: '',
  new_password: '',
  confirm_password: '',
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.value.new_password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  old_password: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
  ],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirm_password: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

// 进度条偏移量
const progressOffset = computed(() => {
  const percent = userStore.trafficPercent
  const circumference = 2 * Math.PI * 45
  return circumference - (percent / 100) * circumference
})

// 到期时间文本
const expiredText = computed(() => {
  if (!userStore.expiredAt) return '未知'
  return formatDate(userStore.expiredAt)
})

// 剩余天数
const remainingDays = computed(() => {
  if (!userStore.expiredAt) return 0
  return getRemainingDays(userStore.expiredAt)
})

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      changingPassword.value = true
      try {
        await changePassword({
          old_password: passwordForm.value.old_password,
          new_password: passwordForm.value.new_password,
        })
        
        ElMessage.success('密码修改成功')
        passwordForm.value = {
          old_password: '',
          new_password: '',
          confirm_password: '',
        }
        passwordFormRef.value.resetFields()
      } catch (error) {
        console.error('Change password error:', error)
      } finally {
        changingPassword.value = false
      }
    }
  })
}

// 重置订阅地址
const handleResetSubscribe = async () => {
  try {
    resettingSubscribe.value = true
    await resetSubscribe()
    await userStore.fetchSubscribe()
    ElMessage.success('订阅地址已重置')
  } catch (error) {
    ElMessage.error('重置订阅失败')
  } finally {
    resettingSubscribe.value = false
  }
}

onMounted(async () => {
  try {
    loading.value = true
    await userStore.refreshAll()
  } catch (error) {
    ElMessage.error('加载用户信息失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.profile-page {
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

.profile-content {
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
  margin-bottom: 32px;
}

/* Stats Card */
.traffic-info {
  display: flex;
  gap: 48px;
  align-items: center;
}

.traffic-chart {
  flex-shrink: 0;
}

.progress-circle {
  position: relative;
  width: 200px;
  height: 200px;
}

.progress-circle svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.progress-bg {
  fill: none;
  stroke: rgba(59, 130, 246, 0.1);
  stroke-width: 8;
}

.progress-bar {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 282.7;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-text .percent {
  display: block;
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #3B82F6, #0EA5E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-text .label {
  font-size: 14px;
  color: #999;
}

.traffic-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-label {
  color: #999;
  font-size: 14px;
}

.detail-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.detail-value.expired {
  color: #f56c6c;
}

.detail-value.highlight {
  background: linear-gradient(135deg, #3B82F6, #0EA5E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
}

/* Info Card */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  color: #999;
  font-size: 14px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.token-input {
  font-family: monospace;
  font-size: 14px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }
  
  .traffic-info {
    flex-direction: column;
    gap: 32px;
  }
  
  .progress-circle {
    width: 180px;
    height: 180px;
  }
}
</style>
