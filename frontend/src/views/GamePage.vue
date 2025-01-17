<template>
    <div class="relative flex items-center justify-center h-screen bg-gray-100">
      <!-- Circle for players -->
      <div class="relative w-[600px] h-[600px] flex items-center justify-center rounded-full border-4 border-gray-300">
        <!-- Players -->
        <div
            v-for="(player, index) in players"
            :key="player.id"
            :style="getPlayerPosition(index, players.length)"
            :class="[
                'absolute text-sm font-semibold py-2 px-4 rounded-lg shadow text-center',
                player.name === 'ME' ? 'bg-green-500 text-white' : 'bg-gray-300'
            ]"
            >
            {{ player.name }}
            </div>

  
        <!-- Letters in the middle -->
        <div class="bg-blue-500 text-white text-4xl font-bold py-6 px-12 rounded-full shadow-lg text-center">
          Letters
        </div>
      </div>
  
      <!-- Input Field and "Me" -->
      <div class="absolute bottom-10 w-full flex flex-col items-center">
        <!-- Input Field -->
        <input
          type="text"
          placeholder="Enter your word..."
          class="p-3 w-3/4 max-w-md border rounded-lg text-center"
        />
        <!-- Current Player (Me) -->
        <div class="bg-green-500 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow mt-4">
          Me
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Mock data for up to 8 players
  const players = ref([
    { id: 1, name: "ME" },
    { id: 2, name: "Player 2" },
    { id: 3, name: "Player 3" },
    { id: 4, name: "Player 4" },
    { id: 5, name: "Player 5" },
    { id: 6, name: "Player 6" },
    { id: 7, name: "Player 7" },
    { id: 8, name: "Player 8" },
  ]);
  
  // Calculate player position in a circular layout
  const getPlayerPosition = (index, totalPlayers) => {
    const angle = (index / totalPlayers) * 360; // Calculate angle for each player
    const radius = 300; // Radius of the circle
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
  
    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  };
  </script>
  
  <style>
  /* Optional global styles */
  </style>
  