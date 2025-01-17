<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 class="text-4xl font-bold mb-8">Welcome to Bomb Party!</h1>
      <div class="space-y-6">
        <LobbyInput @join-lobby="joinLobby" />
        <CreateLobby @create-lobby="createLobby" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  import LobbyInput from "../components/LobbyInput.vue";
  import CreateLobby from "../components/CreateLobby.vue";
  
  const router = useRouter();
  
  const joinLobby = (code) => {
    router.push(`/game/${code}`);
  };
  
  const createLobby = () => {
    const newLobbyId = Math.random().toString(36).substring(7);
    router.push(`/game/${newLobbyId}`);
  };
  </script>
  