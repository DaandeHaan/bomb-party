<template>
  <div class="flex flex-col md:flex-row h-dvh relative">
    <!-- Mobile & Small Desktop Buttons (Hidden on Large Screens) -->
    <div class="fixed bottom-4 left-4 right-4 flex gap-4 md:hidden">
      <button @click="openModal('settings')" class="p-2 bg-blue-500 text-white rounded">Settings</button>
      <button @click="openModal('lobbies')" class="p-2 bg-green-500 text-white rounded">Lobbies</button>
    </div>

    <!-- Main Layout -->
    <div class="flex flex-col md:flex-row flex-1 justify-center items-center gap-12 w-full px-4 md:px-0">
      <div class="hidden md:flex flex-col w-1/4 max-w-sm">
        <Settings :config="config" @update="updateSettings" />
      </div>
      <div class="flex flex-1 justify-center">
        <JoinGame :config="config" class="w-full max-w-md" />
      </div>
      <div class="hidden md:flex flex-col w-1/4 max-w-sm">
        <AvailableGames :games="games" @join="joinLobby" />
      </div>
    </div>

    <!-- Mobile Modal -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-transparent p-6 rounded-lg w-3/4 max-w-md relative">
        <button @click="closeModal" class="absolute top-2 right-2 text-white">&times;</button>
        <template v-if="modalType === 'settings'">
          <Settings :config="config" @update="updateSettings" class="w-full max-w-sm bg-background p-4 rounded-lg" />
        </template>
        <template v-if="modalType === 'lobbies'">
          <AvailableGames :games="games" @join="joinLobby" class="w-full max-w-sm bg-background p-4 rounded-lg" />
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

const games = ref([]);
const config = reactive({
  difficulty: "easy",
  language: "dutch",
  privateGame: false,
  maxPlayers: 8,
  timer: 10,
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
