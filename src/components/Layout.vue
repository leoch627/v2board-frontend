<template>
  <div class="anime-layout">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="star anime-star" v-for="i in 20" :key="i" :style="getStarStyle(i)"></div>
    </div>
    
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-container">
        <slot></slot>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="anime-footer">
      <p class="footer-text">
        Made with <span class="text-gradient-pink">❤</span> by V2Board
      </p>
    </footer>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'

// 生成随机星星样式
const getStarStyle = (index) => {
  const top = Math.random() * 100
  const left = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 2 + Math.random() * 2
  
  return {
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  }
}
</script>

<style scoped>
.anime-layout {
  min-height: 100vh;
  position: relative;
}

.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
}

.main-content {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 200px);
  padding-bottom: 60px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.anime-footer {
  position: relative;
  z-index: 1;
  padding: 24px;
  text-align: center;
}

.footer-text {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .content-container {
    padding: 0 16px;
  }
}
</style>
