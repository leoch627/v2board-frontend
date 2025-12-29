<template>
  <nav class="anime-navbar glass-effect">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <div class="brand-logo">
            <span class="text-gradient-pink">✨</span>
          </div>
          <span class="brand-text text-gradient-pink">V2Board</span>
        </router-link>
      </div>
      
      <div v-if="isLoggedIn" class="navbar-menu">
        <router-link to="/plans" class="nav-item" active-class="active">
          <el-icon><ShoppingCart /></el-icon>
          <span>套餐</span>
        </router-link>
        <router-link to="/orders" class="nav-item" active-class="active">
          <el-icon><Document /></el-icon>
          <span>订单</span>
        </router-link>
        <router-link to="/subscribe" class="nav-item" active-class="active">
          <el-icon><Link /></el-icon>
          <span>订阅</span>
        </router-link>
        <router-link to="/profile" class="nav-item" active-class="active">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
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
import { ShoppingCart, Document, Link, User, SwitchButton } from '@element-plus/icons-vue'

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
.anime-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 16px 0;
  margin-bottom: 32px;
  animation: slide-in-top 0.5s ease-out;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.brand-link:hover {
  transform: scale(1.05);
}

.brand-logo {
  font-size: 32px;
  animation: float 3s ease-in-out infinite;
}

.brand-text {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
}

.navbar-menu {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.nav-item:hover {
  background: rgba(255, 107, 157, 0.1);
  color: #FF6B9D;
  transform: translateY(-2px);
}

.nav-item.active {
  background: linear-gradient(135deg, #FF6B9D, #FFA8D5);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.logout-btn {
  margin-left: 8px;
}

.logout-btn:hover {
  background: rgba(255, 107, 157, 0.1);
  color: #FF6B9D;
}

@media (max-width: 768px) {
  .navbar-menu {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .nav-item span {
    display: none;
  }
  
  .nav-item {
    padding: 10px;
  }
}
</style>
