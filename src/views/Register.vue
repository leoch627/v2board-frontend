<template>
  <div class="register-page">
    <div class="register-container">
      <div class="auth-card">
        <!-- Logo and Title -->
        <div class="register-header">
          <div class="logo">LeiterUp</div>
          <h1 class="title">创建账户</h1>
          <p class="subtitle">请输入您的信息以开始使用</p>
        </div>
        
        <!-- Register Form -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          @submit.prevent="handleRegister"
          label-position="top"
          hide-required-asterisk
        >
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="registerForm.email"
              placeholder="name@example.com"
              class="apple-input"
              size="large"
            />
          </el-form-item>
          
          <el-form-item prop="email_code" label="验证码" v-if="config && (config.email_verify === 1 || config.is_email_verify === 1)">
            <div style="display: flex; gap: 12px;">
              <el-input
                v-model="registerForm.email_code"
                placeholder="6位验证码"
                class="apple-input"
                size="large"
                style="flex: 1;"
              />
              <el-button
                :loading="sendingCode"
                :disabled="countdown > 0"
                size="large"
                @click="handleSendEmailCode"
                class="verify-button"
                style="width: 110px;"
              >
                {{ countdown > 0 ? `${countdown}s` : '发送' }}
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder=""
              class="apple-input"
              size="large"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="password_confirmation" label="确认密码">
            <el-input
              v-model="registerForm.password_confirmation"
              type="password"
              placeholder=""
              class="apple-input"
              size="large"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="invite_code" label="邀请码">
            <el-input
              v-model="registerForm.invite_code"
              :placeholder="config && config.is_invite_force === 1 ? '（必填）' : '（可选）'"
              class="apple-input"
              size="large"
            />
          </el-form-item>
          
          <el-button
            :loading="loading"
            class="register-button"
            type="primary"
            size="large"
            @click="handleRegister"
          >
            <span v-if="!loading">注册</span>
            <span v-else>注册中...</span>
          </el-button>
        </el-form>
        
        <!-- Login Link -->
        <div class="form-footer">
          <div class="login-link">
            <span>已有账号？</span>
            <router-link to="/login" class="link">登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
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
        router.push('/dashboard')
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
  padding: 40px 24px;
  background-color: #fbfbfd;
}

.register-container {
  width: 100%;
  max-width: 480px;
}

.auth-card {
  padding: 56px 60px;
  background: #fff;
  /* Soft, apple-like shadow */
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1d1d1f;
  letter-spacing: -0.5px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #86868b;
  font-size: 17px;
  font-weight: 400;
}

.register-form :deep(.el-form-item__label) {
  padding-bottom: 8px;
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 500;
}

.register-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #d2d2d7 inset !important;
  background-color: transparent;
  border-radius: 12px;
  padding: 8px 12px;
  height: 46px;
  transition: all 0.2s ease;
}

.register-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #0071e3 inset !important;
}

.verify-button {
  height: 46px;
  border-radius: 12px;
  border: 1px solid #d2d2d7;
  color: #0071e3;
  font-weight: 500;
}

.verify-button:hover:not(:disabled) {
  background-color: #f5f5f7;
  border-color: #d2d2d7;
  color: #0077ed;
}

.register-button {
  width: 100%;
  height: 48px;
  font-size: 17px;
  font-weight: 500;
  margin-top: 12px;
  border-radius: 12px;
  background-color: #0071e3;
  border: none;
  transition: background-color 0.2s;
}

.register-button:hover,
.register-button:focus {
  background-color: #0077ed;
}

.form-footer {
  margin-top: 32px;
  text-align: center;
}

.login-link {
  font-size: 15px;
  color: #424245;
}

.login-link .link {
  color: #0071e3;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
}

.login-link .link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 40px 24px;
    box-shadow: none;
    background: transparent;
    border: none;
  }
  
  .register-page {
    background-color: #fff;
    align-items: flex-start;
    padding: 0;
  }

  .register-container {
    padding-top: 40px;
  }
}
</style>
