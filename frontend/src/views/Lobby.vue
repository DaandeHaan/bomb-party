<template>
  <div class="flex flex-col md:flex-row h-dvh relative">
    <!-- Mobile & Small Desktop Buttons (Hidden on Large Screens) -->
    <div class="fixed top-4 left-4 right-4 flex gap-4 md:hidden">
      <button @click="openModal('settings')" class="p-2 bg-gradient-to-br from-primary-accent to-secondary-accent text-white rounded hover:scale-105">Settings</button>
      <button @click="openModal('lobbies')" class="p-2 bg-gradient-to-br from-primary-accent to-secondary-accent text-white rounded hover:scale-105">Lobbies</button>
      <button @click="openModal('explanation')" class="p-2 bg-gradient-to-br from-primary-accent to-secondary-accent text-white rounded hover:scale-105">How to play</button>
    </div>

    <button @click="openModal('explanation')" class="absolute top-2 right-2 hidden md:block p-2 bg-gradient-to-br from-primary-accent to-secondary-accent text-white rounded hover:scale-105">How to play</button>

    <!-- Main Layout -->
    <div class="flex flex-col md:flex-row flex-1 justify-center items-center gap-4 w-full p-4">
      <div class="hidden w-full h-full md:flex items-center">
        <Settings :config="config" @update="updateSettings" />
      </div>
      <div class="w-full h-full flex items-end md:items-center">
        <JoinGame :config="config" class="w-full max-w-md" />
      </div>
      <div class="hidden w-full h-full md:flex items-center">
        <AvailableGames :games="games" @join="joinLobby" />
      </div>
    </div>

    <!-- Mobile Modal -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div v-on:click="closeModal" class="bg-transparent w-full h-dvh absolute"></div>
      <div class="bg-transparent rounded-lg mt-16">
        <button @click="closeModal" class="z-50 border-2 border-border bg-background rounded-full size-8 text-center flex items-center justify-center absolute top-2 right-2 text-white text-3xl">
          <font-awesome-icon icon="close" class="text-sm text-text" />
        </button>
        <template v-if="modalType === 'settings'">
          <Settings :config="config" @update="updateSettings" class="max-w-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full bg-background p-4 rounded-lg border-2 border-border" />
        </template>
        <template v-if="modalType === 'lobbies'">
          <AvailableGames :games="games" @join="joinLobby" class="max-w-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full bg-background p-4 rounded-lg border-2 border-border" />
        </template>
        <template v-if="modalType === 'explanation'">
          <Explanation class="max-w-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full bg-background p-4 rounded-lg border-2 border-border" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Settings from "../components/lobby/Settings.vue";
import AvailableGames from "../components/lobby/AvailableGames.vue";
import JoinGame from "../components/lobby/JoinGame.vue";
import Explanation from "../components/lobby/Explanation.vue";

const games = ref([]);
const config = reactive({
  difficulty: "easy",
  language: "dutch",
  privateGame: false,
  maxPlayers: 8,
  defaultTimer: 10,
  lives: 2,
});

const updateSettings = (newSettings) => {
  Object.assign(config, newSettings);
};

const modalOpen = ref(false);
const modalType = ref("");

const openModal = (type) => {
  modalType.value = type;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};
</script>
