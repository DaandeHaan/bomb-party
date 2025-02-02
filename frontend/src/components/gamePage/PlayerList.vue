<template>

  <div class="w-full flex flex-row-reverse md:flex-row justify-between text-text">

    <!-- PlayerList -->
    <div class="p-4 bg-background border-2 border-border rounded-lg shadow-lg hidden md:block">

      <h1 class="text-center border-b font-bold text-xl pb-1 mb-1 select-none">Players <span class="text-gray-400">(wins)</span></h1>

      <div v-for="(player, index) in props.players">
        <div class="flex items-center justify-between max-w-96 overflow-hidden" :class="{ 'opacity-50' : !player.isReady }">
          <div class="flex items-center max-w-96 overflow-hidden">
            <div v-if="player.isOwner"><font-awesome-icon icon="crown" class="text-sm mr-1 text-[#d4af37]" /></div>
            <div class="max-w-96 overflow-hidden text-ellipsis select-none">{{ player.username }} <span class="text-gray-400">({{ player.wins }})</span></div>
          </div>
        </div>
      </div>

    </div>

    <!-- LobbyCode -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 text-center hover:scale-105 transition-all duration-300 flex-1" v-on:click="copyUrl">
      <p class="text-xs">Lobby code</p>
      <h1 class="w-full text-center text-primary-accent font-extrabold text-3xl">{{ lobbyCode }}</h1>
    </div>

    <!-- Back To Lobby -->
    <button
      id="backToLobby"
      @click="$emit('toLobby')"
      class="select-none max-h-[2rem] py-1 px-2 md:py-1 md:px-6 rounded-lg bg-primary-accent text-[#1E1E2E] font-semibold shadow-md hover:scale-105 transition-all duration-300"
    >
      Lobby
    </button>


  </div>


</template>

<script setup>
import { useToast } from 'vue-toastification';

const emit = defineEmits(['toLobby']);

const toast = useToast();

const copyUrl = () => {
  const currentUrl = window.location.href;  // Get the current URL
  navigator.clipboard.writeText(currentUrl)  // Copy the URL to clipboard
    .then(() => {
      toast.success("URL copied to clipboard!", { timeout: 1000 });  // Success message
    })
    .catch(err => {
      console.error("Failed to copy the URL: ", err);  // Error handling
    });
};

const props = defineProps({
  players: Array,
  lobbyCode: String,
});
</script>