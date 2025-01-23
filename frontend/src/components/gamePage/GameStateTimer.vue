<template>
  <div v-if="currentTimer > 0" class="absolute top-5 text-center text-lg text-gray-500">
    {{ currentTimer.toFixed(1) }} seconds left.
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";

const currentTimer = ref(0); // Internal countdown timer
let intervalId = null;

// Method to start the countdown
const startTimer = (time) => {
  // Clear any existing timer
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Set the timer to the given time
  currentTimer.value = time;

  // Start the countdown
  intervalId = setInterval(() => {
    if (currentTimer.value > 0) {
      currentTimer.value = Math.max(0, currentTimer.value - 0.1); // Decrease by 0.1 seconds
    } else {
      clearInterval(intervalId); // Stop the timer when it reaches 0
    }
  }, 100); // Run every 100ms
};

// Cleanup interval when the component is destroyed
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

// Expose the startTimer method to the parent
defineExpose({
  startTimer,
});
</script>
