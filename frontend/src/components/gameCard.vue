<template>

      <h3 class="text-lg font-semibold">Bomb Party Regular</h3>
      <p class="text-sm text-gray-600">Host: {{ game.players.find(player => player.isOwner)?.username || "Unknown" }}</p>
      <p class="text-sm text-gray-600">Diffuculty: {{ game.diffuculty }}</p>
      <p class="text-sm text-gray-600">language: {{ game.language }}</p>
      <p class="text-sm text-gray-600">Players: {{ game.players.length }}</p>
      <button
        @click="joinLobby(game.gameID)"
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Join Game: {{ game.gameID }}
      </button>

</template>

<script setup>    
  defineProps({
    game: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(["join-lobby"]);

  const joinLobby = (gameID) => {
    emit("join-lobby", gameID); // Pass gameID to the emitted event
  };
</script>
