<template>
  <div v-if="currentTimer > 0" class="absolute top-5 text-center text-3xl text-[#7DCFFF]">
    {{ currentTimer.toFixed(1) }} seconds left.
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";

const currentTimer = ref(0);
let intervalId = null;

const startTimer = (time) => {
  if (intervalId) {
    clearInterval(intervalId);
  }

  currentTimer.value = time;

  intervalId = setInterval(() => {
    if (currentTimer.value > 0) {
      currentTimer.value = Math.max(0, currentTimer.value - 0.1);
    } else {
      clearInterval(intervalId);
    }
  }, 100);
};

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

defineExpose({
  startTimer,
});
</script>
