<template>
  <div class="flex justify-between h-dvh">
    <Settings :config="config" @update="updateSettings" />

    <JoinGame :config="config"/>

    <AvailableGames :games="games" @join="joinLobby" />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Settings from "../components/lobby/Settings.vue";
import AvailableGames from "../components/lobby/AvailableGames.vue";
import JoinGame from "../components/lobby/JoinGame.vue";

const games = ref([]); // Store available games
const config = reactive({
  difficulty: "easy",
  language: "dutch",
  privateGame: false,
  maxPlayers: 8,
  timer: 10,
  lives: 2,
});

const updateSettings = (newSettings) => {
  Object.assign(config, newSettings); // Update config with new settings from the child component
};
</script>