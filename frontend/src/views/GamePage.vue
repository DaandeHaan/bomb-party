<template>
  <div class="relative flex items-center justify-center h-screen bg-gray-100">
    <!-- Circle for players -->
    <div class="relative w-[600px] h-[600px] flex items-center justify-center rounded-full border-4 border-gray-300 bg-white shadow-lg">
      <!-- Ready Players -->
      <div
        v-for="(player, index) in readyPlayers"
        :key="player.sessionID"
        :style="getPlayerPosition(index, readyPlayers.length)"
        :class="[ 
          'absolute text-sm font-semibold py-2 px-4 rounded-lg shadow text-center',
          player.currentPlayer ? 'bg-green-500 text-white' : 'bg-gray-300',
          player.isYou ? 'border-2 border-red-600' : ''
        ]"
      >
        <!-- Display lives and currentText above the player's username -->
        <div class="text-xs font-medium text-gray-600 mb-1">
          Lives: {{ player.lives }}
        </div>
        <div class="text-xs font-medium text-gray-600 mb-1">
          {{ player.currentText }}
        </div>
        {{ player.username }}
      </div>

      <!-- Letters in the middle -->
      <div class="relative flex flex-col items-center bg-blue-500 text-white text-4xl font-bold py-6 px-12 rounded-full shadow-lg text-center">
        {{ currentHint }}
      </div>
    </div>

    <!-- Input Field -->
    <div class="absolute bottom-10 w-full flex flex-col items-center space-y-4">
      <input
        type="text"
        v-model="inputWord"
        placeholder="Enter your word..."
        class="p-3 w-3/4 max-w-md border rounded-lg text-center shadow focus:outline-none focus:ring focus:ring-blue-400"
        @keydown.enter="sendWord"
        @input="onType"
        :disabled="!isCurrentPlayer && gameHasStarted"
      />
      <!-- Game Start Button -->
      <button
        v-if="!gameHasStarted && isYouAndOwner"
        class="bg-green-600 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow hover:bg-green-700 transition"
        @click="gameStart"
      >
        Start Game
      </button>
      <!-- Ready Up Button -->
      <button
        v-if="!gameHasStarted"
        class="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg shadow hover:bg-blue-700 transition"
        @click="sendReadyUp"
      >
        Ready Up
      </button>
    </div>

    <!-- Game State and Timer -->
    <div v-if="gameState === 'in-progress'" class="absolute top-5 text-center text-lg text-gray-500">
      Game in progress! Timer: {{ timer }} seconds left.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

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

// Filter Players Who Are Ready
const readyPlayers = computed(() => {
  return players.value.filter((player) => player.isReady);
});

// Calculate Player Positions in Circular Layout
const getPlayerPosition = (index, totalPlayers) => {
  const angle = (index / totalPlayers) * 360;
  const radius = 300; // Adjusted to center players better
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

const gameHasStarted = computed(() => {
  return gameState.value === "playing";
});

const isCurrentPlayer = computed(() => {
  return players.value.some((player) => player.isYou && player.currentPlayer);
});

const isYouAndOwner = computed(() => {
  return players.value.some((player) => player.isYou && player.isOwner);
});

const renderGameObject = (game) => {
  if (game.players) {
    players.value = game.players;
  }

  if (game.letters) {
    currentLetters.value = game.letters;
  }

  if (game.guessedWords) {
    console.log("Guessed words:", game.guessedWords);
  }

  if (game.gameState) {
    gameState.value = game.gameState;
  }

  if (game.timer !== undefined) {
    timer.value = game.timer;
  }

  if (game.currentHint) {
    currentHint.value = game.currentHint;
  }
};

const connectWebSocket = () => {
  if (!webSocketUrl) {
    console.error("WebSocket URL is missing.");
    return;
  }

  ws.value = new WebSocket(webSocketUrl);

  ws.value.onopen = () => {
    console.log("WebSocket connected");
  };

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Message from server:", data);
    renderGameObject(data);
  };

  ws.value.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.value.onclose = () => {
    console.log("WebSocket connection closed");
  };
};

const sendWord = () => {
  if (inputWord.value.trim() === "") {
    console.warn("No word entered.");
    return;
  }

  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "submit", word: inputWord.value.trim() }));
    inputWord.value = ""; // Clear the input after sending
  } else {
    console.warn("WebSocket is not connected");
  }
};

// Handle typing updates
const onType = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "typing", currentText: inputWord.value.trim() }));
  } else {
    console.warn("WebSocket is not connected");
  }
};

const sendReadyUp = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "readyUp" }));
    console.log("Ready up message sent.");
  } else {
    console.warn("WebSocket is not connected");
  }
};

// Start the game
const gameStart = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "gameStart" }));
    console.log("Game start message sent.");
  } else {
    console.warn("WebSocket is not connected");
  }
};

// Lifecycle Hooks
onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});
</script>

<style>
/* Add additional global styles if needed */
</style>
