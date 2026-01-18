<template>
  <div class="app-layout">
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-container">
        <slot></slot>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="app-footer">
      <p class="footer-text">
        &copy; {{ new Date().getFullYear() }} LeiterUp. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  position: relative;
  background-color: #fbfbfd; /* Apple-like background */
}

.main-content {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 120px);
  padding-bottom: 60px;
}

.content-container {
  max-width: 1080px; /* Reduced width for better reading experience, typical of modern dashboards */
  margin: 0 auto;
  padding: 0 40px;
}

.app-footer {
  position: relative;
  z-index: 1;
  padding: 32px 0 48px;
  text-align: center;
}

.footer-text {
  color: #86868b;
  font-size: 13px;
  font-weight: 400;
}

@media (max-width: 768px) {
  .content-container {
    padding: 0 20px;
  }
}
</style>
