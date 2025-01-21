<template>
  <div class="relative flex items-center justify-center h-screen bg-gray-100">
    <!-- Circle for players -->
    <PlayerCircle :players="players" :gameHasStarted="gameHasStarted" :lastWinner="lastWinner" :currentHint="currentHint" />
    
    <InputField
      v-model="inputWord"
      :isCurrentPlayer="isCurrentPlayer"
      :gameHasStarted="gameHasStarted"
      :isYouAndOwner="isYouAndOwner"
      :currentPlayer="currentPlayer"
      @sendWord="sendWord"
      @onType="onType"
      @gameStart="gameStart"
      @toggleReadyUp="toggleReadyUp"
    />


    <!-- Game State and Timer -->
    <GameStateTimer v-if="gameState === 'playing'" :timer="timer" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import PlayerCircle from '../components/gamePage/PlayerCircle.vue';
import InputField from '../components/gamePage/InputField.vue';
import GameStateTimer from '../components/gamePage/GameStateTimer.vue';

// State Variables
const players = ref([]);
const currentLetters = ref("Letters");
const inputWord = ref("");
const gameState = ref("lobby");
const timer = ref(10);
const currentHint = ref("");
const ws = ref(null);

// Route Parameters
const route = useRoute();
const webSocketUrl = route.params.webSocketUrl;

// Computed Properties and Methods (Shared Logic)
const readyPlayers = computed(() => players.value.filter(player => player.isReady));
const currentPlayer = computed(() => players.value.find(player => player.isYou) || {});
const gameHasStarted = computed(() => gameState.value === "playing");
const isCurrentPlayer = computed(() => players.value.some(player => player.isYou && player.currentPlayer));
const isYouAndOwner = computed(() => players.value.some(player => player.isYou && player.isOwner));
const lastWinner = computed(() => players.value.find(player => player.lastWinner) || null);

const connectWebSocket = () => {
  if (!webSocketUrl) {
    console.error("WebSocket URL is missing.");
    return;
  }

  ws.value = new WebSocket(webSocketUrl);

  ws.value.onopen = () => console.log("WebSocket connected");
  ws.value.onmessage = event => renderGameObject(JSON.parse(event.data));
  ws.value.onerror = error => console.error("WebSocket error:", error);
  ws.value.onclose = () => console.log("WebSocket connection closed");
};

const renderGameObject = game => {
  players.value = game.players || players.value;
  currentLetters.value = game.letters || currentLetters.value;
  gameState.value = game.gameState || gameState.value;
  timer.value = game.timer ?? timer.value;
  currentHint.value = game.currentHint || currentHint.value;
};

const sendWord = () => {
  if (inputWord.value.trim()) {
    ws.value?.send(JSON.stringify({ type: "submit", word: inputWord.value.trim() }));
    inputWord.value = "";
  }
};

const onType = () => {
  ws.value?.send(JSON.stringify({ type: "typing", currentText: inputWord.value.trim() }));
};

const toggleReadyUp = () => {
  ws.value?.send(JSON.stringify({ type: "readyUp" }));
};

const gameStart = () => {
  ws.value?.send(JSON.stringify({ type: "gameStart" }));
};

// Lifecycle Hooks
onMounted(() => connectWebSocket());
onUnmounted(() => ws.value?.close());
</script>
