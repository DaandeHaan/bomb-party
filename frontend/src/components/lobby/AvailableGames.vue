<template>
  <div class="w-full max-w-lg mx-auto px-4">
    <h1 class="text-text text-4xl font-bold text-center md:text-5xl">Available Games</h1>

    <div class="flex flex-col gap-6 mt-6 h-[34rem] overflow-scroll no-scrollbar">
      <GameCard v-for="game in games" :key="game.id" :game="game" @click="joinLobby(game.id)" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import GameCard from "./GameCard.vue";
import axios from "axios";

const games = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://dishmanagement.com:3000/api/game");
    games.value = response.data.games;
  } catch (error) {
    console.error("Error fetching games:", error);
  }
});

const emit = defineEmits(["join"]);
const joinLobby = (gameId) => emit("join", gameId);
</script>
