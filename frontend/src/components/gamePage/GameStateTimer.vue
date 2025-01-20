<template>
    <div class="absolute top-5 text-center text-lg text-gray-500">
      Game in progress! Timer: {{ timer }} seconds left.
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    timer: Number,
  });
  </script>
  