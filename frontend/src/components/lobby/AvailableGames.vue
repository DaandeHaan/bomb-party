<template>
  <div class="bg-blue-500 w-full">

  </div>
</template>

<script setup>

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