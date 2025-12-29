<template>
  <div class="anime-card" :class="[hoverEffect && 'anime-card-hover', customClass]">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  hoverEffect: {
    type: Boolean,
    default: true,
  },
  customClass: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.anime-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px 0 rgba(255, 107, 157, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.anime-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #FF6B9D, #C77DFF, #89CFF0, #FFA8D5);
  border-radius: 20px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.anime-card-hover:hover::before {
  opacity: 0.3;
}
</style>
