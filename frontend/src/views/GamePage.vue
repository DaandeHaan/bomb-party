<template>
  <div class="overflow-hidden relative flex items-center justify-center min-h-screen bg-gradient-to-b from-[#1E1E2E] to-[#121221] text-[#D9E0EE]">
    <!-- Player Circle -->

    <PlayerList :players="players" />

    <PlayerCircle
      :players="players"
      :gameHasStarted="gameHasStarted"
      :lastWinner="lastWinner"
      :currentHint="currentHint"
      :isCurrentPlayer="isCurrentPlayer"
      :defaultLives="defaultLives"
    />

    <!-- Input Field -->
    <InputField
      ref="inputFieldRef"
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

    <!-- Game State Timer -->
    <GameStateTimer
      :class="[!gameHasStarted ? 'hidden' : '']"
      ref="gameStateTimer"
    />
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick  } from "vue";
import { useRoute } from "vue-router";
import PlayerCircle from '../components/gamePage/PlayerCircle.vue';
import InputField from '../components/gamePage/InputField.vue';
import GameStateTimer from '../components/gamePage/GameStateTimer.vue';
import { useToast } from "vue-toastification";
import PlayerList from "../components/gamePage/PlayerList.vue";

// State Variables
const gameStateTimer = ref(null);
const players = ref([]);
const currentLetters = ref("Letters");
const inputWord = ref("");
const gameState = ref("lobby");
const timer = ref(10);
const currentHint = ref("");
const ws = ref(null);
const defaultLives = ref(2);
const inputFieldRef = ref(null);

// Route Parameters
const route = useRoute();
const webSocketUrl = route.params.webSocketUrl;
const toast = useToast();

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
  ws.value.onmessage = event => checkMessageType(JSON.parse(event.data));
  ws.value.onerror = error => console.error("WebSocket error:", error);
  ws.value.onclose = () => route.push('lobby');
};

const checkMessageType = message =>{

  console.log(message)
  if(message.type === 'gameObj'){
    renderGameObject(message.data)
  }
  if(message.type === 'NOT_ENOUGH_PLAYERS'){
    shakeScreen();
    playSound("error");
    toast.error("Not enough players to start the game.");
  }
  if(message.type === "WORD_NOT_FOUND") {
    shakeScreen();
    playSound("error");
  }
};

const shakeScreen = () => {
  const element = document.getElementById('shake');

  if (!element) return;

  element.classList.add('animate-shake');

  setTimeout(() => {
    element.classList.remove('animate-shake');
  }, 500);
}

const playSound = (sound) => {
  const audio = new Audio(`/assets/${sound}.mp3`);
  audio.play();
};

const renderGameObject = game => {
  checkNextTurn(game);
  players.value = game.players || players.value;
  currentLetters.value = game.letters || currentLetters.value;
  gameState.value = game.gameState || gameState.value;
  timer.value = game.timer ?? timer.value;
  currentHint.value = game.currentHint || currentHint.value;
  
  if (isCurrentPlayer.value) {
    // Input field still has to enable, so focus after that tick
    nextTick(() => { 
      focusInputField();
    });
  }
};

const checkNextTurn = (game) => {
  const incomingCurrentPlayer = game.players?.find(player => player.currentPlayer);

  const localCurrentPlayer = players.value.find(player => player.currentPlayer);

  if (incomingCurrentPlayer?.id !== localCurrentPlayer?.id) {
    gameStateTimer.value.startTimer(game.timer);
  }

  if (localCurrentPlayer?.lives != game.players?.find(player => player.id === localCurrentPlayer?.id)?.lives) {
    playSound("error");
  }
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

// Focus the input field
const focusInputField = () => {
  if(!gameHasStarted)
    return;

  if (inputFieldRef.value) {
    const inputElement = inputFieldRef.value.$el.querySelector('input');
    if (inputElement && !inputElement.disabled) {
      inputElement.focus();
    }
  }
};

onMounted(() => {
  connectWebSocket();

  window.addEventListener("click", focusInputField);
  window.addEventListener("focus", focusInputField);
});

onUnmounted(() => {
  ws.value?.close();

  window.removeEventListener("click", focusInputField);
  window.removeEventListener("focus", focusInputField);
});
</script>
