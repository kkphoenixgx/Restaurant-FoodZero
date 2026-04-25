<template>
  <transition name="toast-fade">
    <div v-if="visible" class="default-toast" :style="{ background: backgroundColor }">
      {{ text }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';

const props = defineProps<{
  text: string
  duration?: number // em ms, padrão 3000
  color?: string // cor de fundo opcional
}>();

const visible = ref(false);

const backgroundColor = computed(() =>
  props.color || 'rgba(23, 30, 0, 0.95)'
);

onMounted(() => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, props.duration ?? 3000);
});

watch(() => props.text, (newVal) => {
  if (newVal) {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, props.duration ?? 3000);
  }
});
</script>

<style scoped>
.default-toast {
  position: fixed;
  left: 32px;
  bottom: 32px;
  min-width: 200px;
  max-width: 350px;
  background: rgba(23, 30, 0, 0.95);
  color: var(--white-default, #fff);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  z-index: 9999;
  pointer-events: none;
  opacity: 1;
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.4s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}
</style>
