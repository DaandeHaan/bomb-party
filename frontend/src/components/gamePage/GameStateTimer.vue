<template>
  <div v-if="currentTimer > 0" class="absolute top-5 text-center text-3xl text-[#7DCFFF]">
    <span v-if="gameState == 'lobby'">Game starting in </span>{{ currentTimer.toFixed(1) }} seconds <span v-if="gameState == 'playing'">left</span>
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

defineProps({
  gameState: String,
});

defineExpose({
  startTimer,
});
</script>
