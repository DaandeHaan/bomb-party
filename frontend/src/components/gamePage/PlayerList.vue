<template>

  <div class="absolute top-4 left-4 p-4 bg-background border-2 border-border rounded-lg shadow-lg">

    <h1 class="text-center border-b font-bold text-xl pb-1 mb-1">Players</h1>

    <div v-for="(player, index) in props.players">
      <div class="flex items-center justify-between max-w-96 overflow-hidden" :class="{ 'opacity-50' : !player.isReady }">
        <div class="flex items-center max-w-96 overflow-hidden">
          <div v-if="player.isOwner"><font-awesome-icon icon="crown" class="text-sm mr-1 text-[#d4af37]" /></div>
          <div class="max-w-96 overflow-hidden text-ellipsis">{{ player.username }}</div>
        </div>
      </div>
    </div>

  </div>

</template>

<script setup>
const props = defineProps({
  players: Array,
});

</script>