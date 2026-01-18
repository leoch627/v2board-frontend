<template>
  <nav class="app-navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <div class="brand-logo">
            LeiterUp
          </div>
        </router-link>
      </div>
      
      <div v-if="isLoggedIn" class="navbar-menu">
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <el-icon><Odometer /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link to="/plans" class="nav-item" active-class="active">
          <el-icon><ShoppingCart /></el-icon>
          <span>套餐</span>
        </router-link>
        <router-link to="/orders" class="nav-item" active-class="active">
          <el-icon><Document /></el-icon>
          <span>订单</span>
        </router-link>
        <router-link to="/profile" class="nav-item" active-class="active">
          <el-icon><User /></el-icon>
          <span>账户</span>
        </router-link>
        <button @click="handleLogout" class="nav-item logout-btn">
          <el-icon><SwitchButton /></el-icon>
          <span>退出</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Document, Link, User, SwitchButton, Odometer } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)

const handleLogout = async () => {
  try {
    await authStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  height: 60px;
}

.navbar-container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.01em;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-size: 13px;
  color: #424245;
  font-weight: 500;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
}

.nav-item:hover,
.nav-item.active {
  color: #0071e3;
  background: transparent;
  transform: none;
  box-shadow: none;
}

.logout-btn:hover {
  color: #ff3b30;
  background: transparent;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 20px;
  }
  
  .navbar-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    padding: 10px 0 20px;
    justify-content: space-around;
    gap: 0;
  }

  .nav-item {
    flex-direction: column;
    gap: 4px;
    font-size: 10px;
  }
}
</style>
