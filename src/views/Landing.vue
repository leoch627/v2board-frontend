<template>
  <div class="landing-page" :style="backgroundStyle">
    <div class="overlay"></div>
    <div class="content-container anime-fade-in-scale">
      <AnimeCard class="landing-card">
        <!-- Logo and Title -->
        <div class="landing-header">
          <div class="logo anime-float">✨</div>
          <h1 class="title text-gradient-pink">二次元世界</h1>
          <p class="subtitle">开启你的奇幻旅程</p>
        </div>
        
        <!-- Description -->
        <div class="description">
          <p>欢迎来到我们的二次元服务平台</p>
          <p>享受高速稳定的网络体验</p>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
          <router-link to="/login">
            <el-button class="anime-button login-btn" size="large">
              登录
            </el-button>
          </router-link>
          <router-link to="/register">
            <el-button class="anime-button register-btn" size="large">
              注册
            </el-button>
          </router-link>
        </div>
        
        <!-- Features -->
        <div class="features">
          <div class="feature-item anime-hover-lift">
            <div class="feature-icon">🚀</div>
            <div class="feature-text">高速稳定</div>
          </div>
          <div class="feature-item anime-hover-lift">
            <div class="feature-icon">🔒</div>
            <div class="feature-text">安全加密</div>
          </div>
          <div class="feature-item anime-hover-lift">
            <div class="feature-icon">💎</div>
            <div class="feature-text">优质服务</div>
          </div>
        </div>
      </AnimeCard>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AnimeCard from '@/components/AnimeCard.vue'

// 从环境变量中获取背景图片URL
const bgUrl = import.meta.env.VITE_LANDING_BG_URL || ''

// 根据配置的背景图片URL设置背景样式
const backgroundStyle = computed(() => {
  if (bgUrl) {
    return {
      backgroundImage: `url("${bgUrl}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
  }
  return {}
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #FFF0F5 0%, #E0B0FF 100%);
  position: relative;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  pointer-events: none;
}

.landing-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 107, 157, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: float 20s linear infinite;
  pointer-events: none;
}

.content-container {
  width: 100%;
  max-width: 550px;
  z-index: 1;
}

.landing-card {
  padding: 48px 40px;
  text-align: center;
}

.landing-header {
  margin-bottom: 32px;
}

.logo {
  font-size: 80px;
  margin-bottom: 16px;
}

.title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  color: #999;
  font-size: 16px;
}

.description {
  margin-bottom: 32px;
  color: #666;
  font-size: 15px;
  line-height: 1.8;
}

.description p {
  margin: 8px 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.action-buttons .el-button {
  width: 140px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.login-btn {
  background: linear-gradient(135deg, #FF6B9D, #FFA8D5);
  border: none;
  color: white;
}

.login-btn:hover {
  background: linear-gradient(135deg, #FFA8D5, #FFD4EC);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 157, 0.4);
}

.register-btn {
  background: linear-gradient(135deg, #C77DFF, #E0B0FF);
  border: none;
  color: white;
}

.register-btn:hover {
  background: linear-gradient(135deg, #E0B0FF, #F5E6FF);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(199, 125, 255, 0.4);
}

.features {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-item {
  flex: 1;
  min-width: 120px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: default;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(255, 107, 157, 0.2);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.feature-text {
  color: #666;
  font-size: 14px;
  font-weight: 600;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(-50px, -50px) rotate(360deg);
  }
}

@media (max-width: 768px) {
  .landing-card {
    padding: 32px 24px;
  }
  
  .title {
    font-size: 32px;
  }
  
  .logo {
    font-size: 64px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .el-button {
    width: 100%;
    max-width: 300px;
  }
  
  .features {
    flex-direction: column;
  }
  
  .feature-item {
    min-width: auto;
  }
}
</style>
