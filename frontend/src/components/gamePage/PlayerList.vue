<template>

  <div class="w-full flex flex-row-reverse md:flex-row justify-between text-text">

    <!-- PlayerList -->
    <div class="p-4 bg-background border-2 border-border rounded-lg shadow-lg hidden md:block">

      <h1 class="text-center border-b font-bold text-xl pb-1 mb-1">Players <span class="text-gray-400">(wins)</span></h1>

      <div v-for="(player, index) in props.players">
        <div class="flex items-center justify-between max-w-96 overflow-hidden" :class="{ 'opacity-50' : !player.isReady }">
          <div class="flex items-center max-w-96 overflow-hidden">
            <div v-if="player.isOwner"><font-awesome-icon icon="crown" class="text-sm mr-1 text-[#d4af37]" /></div>
            <div class="max-w-96 overflow-hidden text-ellipsis">{{ player.username }} <span class="text-gray-400">({{ player.wins }})</span></div>
          </div>
        </div>
      </div>

    </div>

    <!-- Back To Lobby -->
    <button
      id="backToLobby"
      @click="$emit('toLobby')"
      class="max-h-[2rem] py-1 px-2 md:py-1 md:px-6 rounded-lg bg-primary-accent text-[#1E1E2E] font-semibold shadow-md hover:scale-105 transition-all duration-300"
    >
      Lobby
    </button>

  </div>


</template>

<script setup>
const emit = defineEmits(['toLobby']);

const props = defineProps({
  players: Array,
});
</script>