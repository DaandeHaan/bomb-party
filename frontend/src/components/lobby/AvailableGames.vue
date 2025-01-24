<template>
  <div class="w-full flex flex-col items-center gap-12">
    <h1 class="text-text text-5xl font-bold pt-28 text-center">Available games</h1>

    <!-- Games -->
    <div class="w-full flex flex-col gap-8 px-24">
      <GameCard v-for="game in games" :key="game.id" :game="game" />
    </div>
  </div>
</template>

<script setup>
import GameCard from './gameCard.vue';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const games = ref([]);
const toast = useToast();

onMounted(() => {
  fetchGames();
});

const fetchGames = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/game");
    games.value = response.data.games; // Assume the API returns an array of games in `response.data.games`
  } catch (error) {
    console.error("Error fetching games:", error);
    toast.error("Failed to fetch available games.");
  }
};


</script>