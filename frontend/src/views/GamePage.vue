<template>
  <div class="relative flex items-center justify-center h-screen bg-gray-100">
    <!-- Circle for players -->
    <div class="relative w-[600px] h-[600px] flex items-center justify-center rounded-full border-4 border-gray-300">
      <!-- Ready Players -->
      <div
        v-for="(player, index) in readyPlayers"
        :key="player.sessionID"
        :style="getPlayerPosition(index, readyPlayers.length)"
        :class="[ 
          'absolute text-sm font-semibold py-2 px-4 rounded-lg shadow text-center',
          player.username === 'ME' ? 'bg-green-500 text-white' : 'bg-gray-300'
        ]"
      >
        <!-- Display lastText above the player's username -->
        <div class="text-xs font-medium text-gray-600 mb-1">
          {{ player.currentText }}
        </div>
        {{ player.username }}
      </div>
    </div>

    <!-- Input Field -->
    <div class="absolute bottom-10 w-full flex flex-col items-center">
      <input
        type="text"
        v-model="inputWord"
        placeholder="Enter your word..."
        class="p-3 w-3/4 max-w-md border rounded-lg text-center"
        @keydown.enter="sendWord"
        @input="onType"
      />
      <div class="bg-green-500 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow mt-4">
        Me
      </div>
      <!-- Ready Up Button -->
      <button
        class="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg shadow mt-4 hover:bg-blue-700"
        @click="sendReadyUp"
      >
        Ready Up
      </button>
    </div>

    <!-- Game State and Timer -->
    <div v-if="gameState === 'in-progress'" class="text-center text-lg text-gray-500 mt-4">
      Game in progress! Timer: {{ timer }} seconds left.
    </div>

    <!-- Hint -->
    <div v-if="currentHint" class="bg-yellow-500 text-white py-2 px-4 rounded-md shadow mt-4">
      Hint: {{ currentHint }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, render } from "vue";
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
  const radius = 300;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

const renderGameObject = (game) => {
// Update Players List
if (game.players) {
      players.value = game.players;
    }

    // Update Letters
    if (game.letters) {
      currentLetters.value = game.letters;
    }

    // Handle Guessed Words
    if (game.guessedWords) {
      console.log("Guessed words:", game.guessedWords);
    }

    // Update Game State
    if (game.gameState) {
      gameState.value = game.gameState;
    }

    // Update Timer
    if (game.timer !== undefined) {
      timer.value = game.timer;
    }

    // Update Hint
    if (game.currentHint) {
      currentHint.value = game.currentHint;
    }
}

// Establish WebSocket Connection
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

// Send the User's Word to the Server
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

const onType = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "typing", word: inputWord.value.trim() }));
    inputWord.value = ""; // Clear the input after sending
  } else {
    console.warn("WebSocket is not connected");
  }
}

// Send Ready Up Message
const sendReadyUp = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "readyUp" }));
    console.log("Ready up message sent.");
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
/* Add any additional styles if necessary */
</style>
