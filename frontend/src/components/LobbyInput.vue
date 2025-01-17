<template>
    <div class="flex flex-col items-center">
      <input
        v-model="code"
        type="text"
        placeholder="Enter Lobby Code"
        class="p-3 border rounded-lg w-64 mb-4"
      />
      <button
        @click="joinLobby"
        class="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Join Lobby
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const emit = defineEmits(["join-lobby"]);
  
  const code = ref("");
  
  const joinLobby = () => {
    if (code.value.trim()) {
      emit("join-lobby", code.value.trim());
    } else {
      alert("Please enter a valid lobby code.");
    }
  };
  </script>
  