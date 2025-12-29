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
              placeholder="邀请码（可选）"
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import AnimeCard from '@/components/AnimeCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const registerFormRef = ref(null)
const loading = ref(false)

const registerForm = reactive({
  email: '',
  password: '',
  password_confirmation: '',
  invite_code: '',
})

const validatePasswordMatch = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  password_confirmation: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePasswordMatch, trigger: 'blur' },
  ],
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
