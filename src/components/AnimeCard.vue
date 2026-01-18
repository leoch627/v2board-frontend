<template>
  <div class="app-card" :class="[hoverEffect && 'app-card-hover', customClass]">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  hoverEffect: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.app-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.app-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>
