<template>

  <div class="absolute top-4 left-4 p-4 bg-background border-2 border-border rounded-lg shadow-lg hidden md:block">

    <h1 class="text-center border-b font-bold text-xl pb-1 mb-1">Players (wins)</h1>

    <div v-for="(player, index) in props.players">
      <div class="flex items-center justify-between max-w-96 overflow-hidden" :class="{ 'opacity-50' : !player.isReady }">
        <div class="flex items-center max-w-96 overflow-hidden">
          <div v-if="player.isOwner"><font-awesome-icon icon="crown" class="text-sm mr-1 text-[#d4af37]" /></div>
          <div class="max-w-96 overflow-hidden text-ellipsis">{{ player.username }} <span class="text-gray-400">({{ player.wins }})</span></div>
        </div>
      </div>
    </div>

  </div>

  <button
    id="backToLobby"
    @click="$emit('toLobby')"
    class="absolute top-4 right-4 md:w-32 py-3 px-6 rounded-lg bg-primary-accent text-[#1E1E2E] font-semibold shadow-md hover:scale-105 transition-all duration-300"
  >
    To Lobby
  </button>

</template>

<script setup>
const emit = defineEmits(['toLobby']);

const props = defineProps({
  players: Array,
});
</script>