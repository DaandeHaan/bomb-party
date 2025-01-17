<template>
    <div class="flex flex-col items-center">
      <button
        @click="createLobby"
        class="bg-green-500 text-white px-6 py-2 rounded-lg"
      >
        Create New Lobby
      </button>
    </div>
  </template>
  
  <script setup>    
    const emit = defineEmits(["create-lobby"]);

  const createLobby = () => {
    emit("create-lobby");
  };
  </script>
  