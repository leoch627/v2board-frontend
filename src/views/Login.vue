<template>
  <div class="login-page">
    <div class="login-container">
      <div class="auth-card">
        <!-- Logo and Title -->
        <div class="login-header">
          <div class="logo">LeiterUp</div>
          <h1 class="title">登录</h1>
          <p class="subtitle">欢迎回来，请登录您的账户</p>
        </div>
        
        <!-- Login Form -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
          label-position="top"
          hide-required-asterisk
        >
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="loginForm.email"
              placeholder="name@example.com"
              class="apple-input"
              size="large"
            />
          </el-form-item>
          
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder=""
              class="apple-input"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
          <el-button
            :loading="loading"
            class="login-button"
            type="primary"
            size="large"
            @click="handleLogin"
          >
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form>
        
        <!-- Register Link -->
        <div class="form-footer">
          <div class="register-link">
            <span>没有账号？</span>
            <router-link to="/register" class="link">创建账户</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref(null)
const loading = ref(false)


const loginForm = reactive({
  email: '',
  password: '',
})

const loginRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await authStore.login(loginForm)
        ElMessage.success('登录成功！')
        router.push('/dashboard')
      } catch (error) {
        console.error('Login error:', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #fbfbfd;
}

.login-container {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  padding: 56px 60px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  /* Optional border for higher contrast/definition */
  border: 1px solid rgba(0, 0, 0, 0.04); 
}

.login-header {
  text-align: center;
  margin-bottom: 48px;
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

.login-form :deep(.el-form-item__label) {
  padding-bottom: 8px;
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 500;
}

.login-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #d2d2d7 inset !important;
  background-color: transparent;
  border-radius: 12px;
  padding: 8px 12px;
  height: 46px;
  transition: all 0.2s ease;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #0071e3 inset !important;
}

.login-button {
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

.login-button:hover,
.login-button:focus {
  background-color: #0077ed;
}

.form-footer {
  margin-top: 32px;
  text-align: center;
}

.register-link {
  font-size: 15px;
  color: #424245;
}

.register-link .link {
  color: #0071e3;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
}

.register-link .link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 40px 24px;
    box-shadow: none;
    background: transparent;
    border: none;
  }
  
  .login-page {
    background-color: #fff;
    align-items: flex-start;
    padding-top: 60px;
  }
}
</style>
