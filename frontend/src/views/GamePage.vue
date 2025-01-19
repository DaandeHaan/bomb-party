<template>
  <div class="relative flex items-center justify-center h-screen bg-gray-100">
    <!-- Circle for players -->
    <div class="relative w-[600px] h-[600px] flex items-center justify-center rounded-full border-4 border-gray-300">
      <!-- Players -->
      <div
        v-for="(player, index) in players"
        :key="player.id"
        :style="getPlayerPosition(index, players.length)"
        :class="[ 
          'absolute text-sm font-semibold py-2 px-4 rounded-lg shadow text-center',
          player.name === 'ME' ? 'bg-green-500 text-white' : 'bg-gray-300'
        ]"
      >
        {{ player.name }}
      </div>

      <!-- Letters in the middle -->
      <div class="bg-blue-500 text-white text-4xl font-bold py-6 px-12 rounded-full shadow-lg text-center">
        {{ currentLetters }}
      </div>
    </div>

    <!-- Input Field and "Me" -->
    <div class="absolute bottom-10 w-full flex flex-col items-center">
      <input
        type="text"
        v-model="inputWord"
        placeholder="Enter your word..."
        class="p-3 w-3/4 max-w-md border rounded-lg text-center"
        @keydown.enter="sendWord"
      />
      <div class="bg-green-500 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow mt-4">
        Me
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router"; // Import useRoute

const players = ref([]);
const currentLetters = ref("Letters");
const inputWord = ref("");
const ws = ref(null);

// Retrieve the WebSocket URL from route parameters
const route = useRoute();
const webSocketUrl = route.params.webSocketUrl;

// Calculate player position in a circular layout
const getPlayerPosition = (index, totalPlayers) => {
  const angle = (index / totalPlayers) * 360; // Calculate angle for each player
  const radius = 300; // Radius of the circle
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

// Establish WebSocket connection
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

    // Update players or letters based on server message
    if (data.players) players.value = data.players;
    if (data.letters) currentLetters.value = data.letters;
  };

  ws.value.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.value.onclose = () => {
    console.log("WebSocket connection closed");
  };
};

// Send the user's word to the server
const sendWord = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "submit", word: inputWord.value }));
    inputWord.value = "";
  } else {
    console.warn("WebSocket is not connected");
  }
};

// Lifecycle hooks
onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});
</script>
