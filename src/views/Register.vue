<template>
  <div class="register-page">
    <div class="register-container anime-fade-in-scale">
      <AnimeCard class="register-card">
        <!-- Logo and Title -->
        <div class="register-header">
          <div class="logo anime-float">🌸</div>
          <h1 class="title text-gradient-purple">加入我们</h1>
          <p class="subtitle">开启你的二次元之旅</p>
        </div>
        
        <!-- Register Form -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="邮箱地址"
              class="anime-input"
              size="large"
              prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="email_code" v-if="config && (config.email_verify === 1 || config.is_email_verify === 1)">
            <div style="display: flex; gap: 8px;">
              <el-input
                v-model="registerForm.email_code"
                placeholder="邮箱验证码"
                class="anime-input"
                size="large"
                prefix-icon="Key"
                style="flex: 1;"
              />
              <el-button
                :loading="sendingCode"
                :disabled="countdown > 0"
                size="large"
                @click="handleSendEmailCode"
                style="width: 120px;"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              class="anime-input"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="password_confirmation">
            <el-input
              v-model="registerForm.password_confirmation"
              type="password"
              placeholder="确认密码"
              class="anime-input"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="invite_code">
            <el-input
              v-model="registerForm.invite_code"
              :placeholder="config && config.is_invite_force === 1 ? '邀请码（必填）' : '邀请码（可选）'"
              class="anime-input"
              size="large"
              prefix-icon="Ticket"
            />
          </el-form-item>
          
          <el-button
            :loading="loading"
            class="register-button anime-button anime-button-purple"
            size="large"
            @click="handleRegister"
          >
            <span v-if="!loading">注册</span>
            <span v-else>注册中...</span>
          </el-button>
        </el-form>
        
        <!-- Login Link -->
        <div class="login-link">
          <span>已有账号？</span>
          <router-link to="/login" class="link">立即登录</router-link>
        </div>
      </AnimeCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import AnimeCard from '@/components/AnimeCard.vue'
import { getConfig, sendEmailVerify } from '@/api/config'

const router = useRouter()
const authStore = useAuthStore()

const registerFormRef = ref(null)
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const config = ref(null)

const registerForm = reactive({
  email: '',
  password: '',
  password_confirmation: '',
  invite_code: '',
  email_code: '',
})

// 获取服务器配置
const fetchConfig = async () => {
  try {
    config.value = await getConfig()
  } catch (error) {
    console.error('Failed to fetch config:', error)
  }
}

// 发送邮箱验证码
const handleSendEmailCode = async () => {
  // 验证邮箱格式
  if (!registerForm.email) {
    ElMessage.error('请输入邮箱地址')
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(registerForm.email)) {
    ElMessage.error('请输入正确的邮箱格式')
    return
  }
  
  // 检查邮箱后缀限制
  if (config.value?.email_whitelist_enable === 1 && config.value?.email_whitelist_suffix) {
    const suffixList = config.value.email_whitelist_suffix
    const emailSuffix = registerForm.email.split('@')[1]
    
    if (!suffixList.includes(emailSuffix)) {
      ElMessage.error(`只允许使用以下邮箱后缀: ${suffixList.join(', ')}`)
      return
    }
  }
  
  sendingCode.value = true
  try {
    await sendEmailVerify({ email: registerForm.email })
    ElMessage.success('验证码已发送到您的邮箱')
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('Failed to send email code:', error)
  } finally {
    sendingCode.value = false
  }
}

// 验证邮箱后缀
const validateEmailSuffix = (rule, value, callback) => {
  if (!value) {
    callback()
    return
  }
  
  if (config.value?.email_whitelist_enable === 1 && config.value?.email_whitelist_suffix) {
    const suffixList = config.value.email_whitelist_suffix
    const emailSuffix = value.split('@')[1]
    
    if (!suffixList.includes(emailSuffix)) {
      callback(new Error(`只允许使用以下邮箱后缀: ${suffixList.join(', ')}`))
      return
    }
  }
  
  callback()
}

const validatePasswordMatch = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = reactive({
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    { validator: validateEmailSuffix, trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  password_confirmation: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePasswordMatch, trigger: 'blur' },
  ],
  email_code: [],
  invite_code: [],
})

// 根据服务器配置动态更新验证规则
const updateValidationRules = () => {
  if (config.value) {
    // 邮箱验证码是否必填
    if (config.value.email_verify === 1 || config.value.is_email_verify === 1) {
      registerRules.email_code = [
        { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
      ]
    }
    
    // 邀请码是否必填
    if (config.value.is_invite_force === 1) {
      registerRules.invite_code = [
        { required: true, message: '请输入邀请码', trigger: 'blur' },
      ]
    }
  }
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await authStore.register(registerForm)
        ElMessage.success('注册成功！')
        router.push('/plans')
      } catch (error) {
        console.error('Register error:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(async () => {
  await fetchConfig()
  updateValidationRules()
})
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #E0B0FF 0%, #FFF0F5 100%);
  position: relative;
  overflow: hidden;
}

.register-page::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(199, 125, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: float 20s linear infinite reverse;
  pointer-events: none;
}

.register-container {
  width: 100%;
  max-width: 450px;
  z-index: 1;
}

.register-card {
  padding: 48px 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 64px;
  margin-bottom: 16px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  color: #999;
  font-size: 14px;
}

.register-form {
  margin-bottom: 24px;
}

.register-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
}

.login-link {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.login-link .link {
  color: #C77DFF;
  text-decoration: none;
  font-weight: 600;
  margin-left: 8px;
  transition: all 0.3s ease;
}

.login-link .link:hover {
  color: #E0B0FF;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-card {
    padding: 32px 24px;
  }
  
  .title {
    font-size: 28px;
  }
}
</style>
