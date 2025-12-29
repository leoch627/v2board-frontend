<template>
  <div class="anime-loading-spinner">
    <div class="anime-loader-balls">
      <div class="anime-loader-ball" style="background: linear-gradient(135deg, #FF6B9D, #FFA8D5);"></div>
      <div class="anime-loader-ball" style="background: linear-gradient(135deg, #C77DFF, #E0B0FF);"></div>
      <div class="anime-loader-ball" style="background: linear-gradient(135deg, #89CFF0, #A0D8F1);"></div>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.anime-loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.loading-text {
  color: #FF6B9D;
  font-size: 14px;
  font-weight: 500;
}
</style>
