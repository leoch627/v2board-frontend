<template>
  <div class="landing-page" :style="backgroundStyle">
    <div class="hero-wrapper">
      <div class="hero-figure" v-if="heroUrl">
        <img :src="heroUrl" alt="Illustration" loading="lazy" />
      </div>

      <div class="hero-content anime-fade-in-scale">
        <p class="eyebrow">LeiterUp · 专业网络加速</p>
        <h1 class="hero-title">
          你想要的
          <br />
          <span class="highlight">超高性价比</span>
        </h1>
        <p class="hero-sub">高速 · 稳定 · 全球互联 · 轻松上手</p>

        <div class="cta-group">
          <router-link to="/plans">
            <el-button class="anime-button cta-primary" size="large">立即购买</el-button>
          </router-link>
          <router-link to="/login">
            <el-button class="anime-button cta-secondary" size="large">了解更多</el-button>
          </router-link>
        </div>

        <div class="pill-row">
          <span class="pill">🚀 高速节点</span>
          <span class="pill">🔒 全链路加密</span>
          <span class="pill">⚡️ 极速体验</span>
        </div>

        <button class="scroll-hint" type="button" @click="scrollToIntro">下滑查看介绍 ↓</button>
      </div>
    </div>

    <section class="intro-section" ref="introSection">
      <div class="section-header">
        <p class="section-eyebrow">Why LeiterUp</p>
        <h2 class="section-title">为您打造的极致网速体验</h2>
        <p class="section-sub">三步开通，流畅视频、直播、游戏加速统统搞定。</p>
      </div>

      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡️</div>
          <h3>秒开高速</h3>
          <p>全球加速线路自动智能切换，晚高峰也能保持稳定低延迟。</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3>全链路安全</h3>
          <p>多重加密和防护策略，守护你的数据与隐私，安心冲浪。</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎮</div>
          <h3>场景预设</h3>
          <p>高清影视、在线游戏、即时通讯，自动分配最优节点。</p>
        </div>
      </div>

      <div class="steps-panel">
        <div class="step-item">
          <span class="step-index">1</span>
          <div>
            <h4>注册登录</h4>
            <p>几秒完成账号创建，支持邮箱与快捷登录。</p>
          </div>
        </div>
        <div class="step-item">
          <span class="step-index">2</span>
          <div>
            <h4>选择套餐</h4>
            <p>按需选择带宽与流量，套餐随时可升级。</p>
          </div>
        </div>
        <div class="step-item">
          <span class="step-index">3</span>
          <div>
            <h4>一键启用</h4>
            <p>复制订阅链接导入客户端，立刻享受全局加速。</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const bgUrl = import.meta.env.VITE_LANDING_BG_URL || ''
const heroUrl = import.meta.env.VITE_LANDING_HERO_URL || ''
const introSection = ref(null)

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

const scrollToIntro = () => {
  if (introSection.value) {
    introSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 10% 10%, rgba(186, 230, 253, 0.24), transparent 30%),
    radial-gradient(circle at 90% 0%, rgba(125, 211, 252, 0.22), transparent 32%),
    #fff;
}

.hero-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px 120px;
  display: grid;
  grid-template-columns: minmax(320px, 520px) 1fr;
  gap: 32px;
  align-items: center;
}

.hero-figure {
  position: relative;
  display: flex;
  justify-content: center;
}

.hero-figure img {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  object-fit: contain;
  filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.12));
}

.hero-content {
  position: relative;
  padding: 40px 32px;
  max-width: 540px;
}

.eyebrow {
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 8px 14px;
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
  border-radius: 999px;
  font-weight: 700;
  margin-bottom: 18px;
  letter-spacing: 0.2px;
}

.hero-title {
  position: relative;
  z-index: 1;
  font-size: 48px;
  line-height: 1.1;
  color: #1f1f1f;
  margin: 0 0 12px;
}

.highlight {
  color: #3B82F6;
}

.hero-sub {
  position: relative;
  z-index: 1;
  color: #555;
  font-size: 16px;
  margin-bottom: 28px;
}

.cta-group {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.cta-primary {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  color: #fff;
  border: none;
  padding: 0 32px;
  height: 52px;
  font-size: 16px;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.35);
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.45);
}

.cta-secondary {
  background: linear-gradient(135deg, #0EA5E9, #38BDF8);
  color: #fff;
  border: none;
  padding: 0 28px;
  height: 52px;
  font-size: 16px;
  box-shadow: 0 14px 30px rgba(14, 165, 233, 0.28);
}

.pill-row {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(59, 130, 246, 0.12);
  color: #2563EB;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
}

.scroll-hint {
  margin-top: 20px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.08);
  color: #3B82F6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scroll-hint:hover {
  transform: translateY(2px);
  background: rgba(59, 130, 246, 0.14);
}

.intro-section {
  position: relative;
  z-index: 2;
  margin: -40px auto 0;
  max-width: 1200px;
  padding: 80px 24px 120px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.9));
  backdrop-filter: blur(8px);
  border-radius: 32px 32px 0 0;
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.08);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-eyebrow {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #3B82F6;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.section-title {
  margin: 12px 0 8px;
  font-size: 32px;
  color: #1f1f1f;
}

.section-sub {
  color: #666;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.feature-card {
  padding: 20px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.08);
}

.feature-icon {
  font-size: 24px;
  margin-bottom: 12px;
}

.feature-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #1f1f1f;
}

.feature-card p {
  margin: 0;
  color: #555;
}

.steps-panel {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.step-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fff, #f0f9ff);
  border: 1px solid rgba(59, 130, 246, 0.12);
}

.step-index {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #3B82F6;
  color: #fff;
  font-weight: 700;
}

.step-item h4 {
  margin: 0 0 4px;
  color: #1f1f1f;
}

.step-item p {
  margin: 0;
  color: #666;
}

@media (max-width: 1024px) {
  .hero-wrapper {
    grid-template-columns: 1fr;
    padding-top: 48px;
  }

  .hero-content {
    order: -1;
  }

  .hero-title {
    font-size: 40px;
  }

  .intro-section {
    margin-top: 0;
    padding: 64px 20px 96px;
  }

  .feature-grid,
  .steps-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .hero-wrapper {
    padding: 48px 16px 80px;
  }

  .hero-title {
    font-size: 32px;
  }

  .cta-group {
    flex-direction: column;
  }

  .section-title {
    font-size: 26px;
  }

  .feature-grid,
  .steps-panel {
    grid-template-columns: 1fr;
  }
}
</style>
