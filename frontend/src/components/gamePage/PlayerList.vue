<template>
  <div class="w-full flex flex-row-reverse md:flex-row justify-between text-text">
    <!-- PlayerList -->
    <div class="p-4 bg-background border-2 border-border rounded-lg shadow-lg hidden md:block">
      <h1 class="text-center border-b font-bold text-xl pb-1 mb-1 select-none">
        Players <span class="text-gray-400">(wins)</span>
      </h1>
      <div v-for="(player, index) in props.players" :key="index">
        <div class="flex items-center justify-between max-w-96 overflow-hidden" :class="{ 'opacity-50' : !player.isReady }">
          <div class="flex items-center max-w-96 overflow-hidden">
            <div v-if="player.isOwner">
              <font-awesome-icon icon="crown" class="text-sm mr-1 text-[#d4af37]" />
            </div>
            <div class="max-w-96 overflow-hidden text-ellipsis select-none">
              {{ player.username }} <span class="text-gray-400">({{ player.wins }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LobbyCode -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 text-center hover:scale-105 transition-all duration-300 flex-1" v-on:click="copyUrl">
      <p class="text-xs">Lobby code</p>
      <h1 class="w-full text-center text-primary-accent font-extrabold text-3xl">{{ lobbyCode }}</h1>
    </div>

    <!-- Back To Lobby Button -->
    <button
        id="backToLobby"
        @click="showConfirmPopup = true"
        class="select-none max-h-[2rem] py-1 px-2 md:py-1 md:px-6 rounded-lg bg-primary-accent text-[#1E1E2E] font-semibold shadow-md hover:scale-105 transition-all duration-300"
    >
      Lobby
    </button>
  </div>

  <!-- Confirmation Popup -->
  <div v-if="showConfirmPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-background p-6 rounded-lg shadow-lg border-2 border-border text-center">
      <h2 class="text-lg font-bold mb-4">Are you sure?</h2>
      <p class="text-sm text-gray-400 mb-4">Do you really want to return to the lobby?</p>
      <div class="flex justify-center gap-4">
        <button @click="confirmReturn" class="px-4 py-2 bg-primary-accent text-[#1E1E2E] rounded-lg shadow-md hover:scale-105 transition-all duration-300">Yes</button>
        <button @click="showConfirmPopup = false" class="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:scale-105 transition-all duration-300">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const emit = defineEmits(['toLobby']);
const toast = useToast();
const showConfirmPopup = ref(false);

const copyUrl = () => {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl)
      .then(() => {
        toast.success("URL copied to clipboard!", { timeout: 1000 });
      })
      .catch(err => {
        console.error("Failed to copy the URL: ", err);
      });
};

const confirmReturn = () => {
  showConfirmPopup.value = false;
  emit('toLobby');
};

const props = defineProps({
  players: Array,
  lobbyCode: String,
});
</script>
