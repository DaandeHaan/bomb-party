<template>
  <div class="overflow-hidden relative flex items-center justify-center min-h-screen bg-gradient-to-b from-[#1E1E2E] to-[#121221] text-[#D9E0EE]">
    <!-- Player Circle -->

    <PlayerList :players="players" class="hidden md:block"/>

    <PlayerCircle
      ref="playerCircle"
      :players="players"
      :gameHasStarted="gameHasStarted"
      :lastWinner="lastWinner"
      :currentHint="currentHint"
      :isCurrentPlayer="isCurrentPlayer"
      :defaultLives="defaultLives"
      :currentText="currentText"
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
      :gameState="gameState"
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
const game = ref({});
const playerCircle = ref(null);
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
const currentText = ref("")
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
  ws.value.onclose = () => route.push('/lobby');
};

const checkMessageType = async (message) =>{

  if(message.type === 'gameObj'){
    renderGameObject(message.data)
  }

  if(message.type === 'PLAYER_JOINED')
  {
    playSound("playerJoined");
  }

  if(message.type === 'PLAYER_LEFT')
  {
    playSound("playerLeft");
  }

  if(message.type === 'NOT_ENOUGH_PLAYERS'){
    shakeScreen("startGameButton");
    playSound("error");
    toast.error("Not enough players to start the game.");
  }

  if(message.type === "GAME_STARTED")
  {
    playSound("beep");

    // Remove all scale classes
    const winnerElements = document.querySelectorAll('.scale-115');
    winnerElements.forEach(element => {
      element.classList.remove('scale-115');
    });

    const loserElements = document.querySelectorAll('.scale-85');
    loserElements.forEach(element => {
      element.classList.remove('scale-85');
    });
  }

  if(message.type === "GAME_FINISHED_WON")
  {
    playSound("gameWon");
    const element = document.getElementById(message.id);
    if (element) {
      element.classList.add('scale-115');
    }

    gameStateTimer.value.startTimer(0);
  }

  if(message.type === "GAME_FINISHED_LOST")
  {
    playSound("gameLost");
    message.losers.forEach(loser => {
      const element = document.getElementById(loser);
      if (element) {
        element.classList.add('scale-85');
      }
    });

    gameStateTimer.value.startTimer(0);
  }


  if(message.type === "WORD_NOT_FOUND") {
    playSound("error");
    shakeScreen(message.id);
  }

  if(message.type === "WORD_FOUND")
  {
    playSound("success");
  }

  if(message.type === "EXCELENT_WORD_FOUND")
  {
    playSound("excelent");
  }

  if(message.type === "PLAYER_DIED")
  {
    playSound("playerDied");
  }

  if(message.type === "LIVE_LOST")
  { 
    playSound("liveLost");
    shakeScreen(message.id); // ! THIS DOES NOT WORK...
  }

  if(message.type === "STARTING_GAME_TIMER") {
    gameStateTimer.value.startTimer(15);
  }

  if(message.type === "CANCEL_STARTING_GAME_TIMER") {
    gameStateTimer.value.startTimer(0);
  }
};

const shakeScreen = (elementID) => {
  const element = document.getElementById(elementID);

  if (!element) 
    return;

  element.classList.add('animate-shake');

  setTimeout(() => {
    element.classList.remove('animate-shake');
  }, 500);
}

const playSound = async (sound, volume = 0.5) => {
  const audio = new Audio(`/assets/${sound}.mp3`);
  audio.play();
  audio.volume = volume;
  await new Promise(resolve => audio.addEventListener('ended', resolve));
};

const renderGameObject = game => {
  checkNextTurn(game);
  game.value = game || {};
  players.value = game.players || players.value;
  currentLetters.value = game.letters || currentLetters.value;
  gameState.value = game.gameState || gameState.value;
  timer.value = game.timer ?? timer.value;
  currentHint.value = game.currentHint || currentHint.value;
  currentText.value = game.currentText || ""; // ! <-- -Error
  defaultLives.value = game.defaultLives || defaultLives.value;
  
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

  // So it is next players turn
  if (incomingCurrentPlayer?.id !== localCurrentPlayer?.id) {
    inputWord.value = "";
    gameStateTimer.value.startTimer(game.timer);
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
