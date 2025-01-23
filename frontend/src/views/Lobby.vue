<template>
  <div class="flex justify-between items-center">

    <div class="w-full">Settings</div>

    <div class="w-full flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 class="text-4xl font-bold mb-8">Welcome to Bomb Party!</h1>
      <div class="space-y-6">
        <!-- Input field for user name -->
        <div class="flex flex-col items-center space-y-4">
          <label for="username" class="text-lg font-medium">Enter Your Name:</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Your name"
            class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <LobbyInput @join-lobby="joinLobby" />
        <CreateLobby @create-lobby="createLobby" />
      </div>
    </div>

    <div class="mt-8 w-full max-w-4xl mx-auto flex items-center justify-center flex-col">
      <h2 class="text-2xl font-bold mb-4">Available Games</h2>

      <div v-if="games.length === 0" class="text-gray-500">
        No games available. Create one to get started!
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <div
          v-for="game in games"
          :key="game.id"
          class="p-4 bg-white shadow rounded flex flex-col justify-between"
        >

          <GameCard @join-lobby="joinLobby" :game="game" />
        
        </div>
      
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import LobbyInput from "../components/LobbyInput.vue";
import CreateLobby from "../components/CreateLobby.vue";
import axios from "axios";
import GameCard from "../components/gameCard.vue";

const username = ref("");
const games = ref([]); // Store available games

const toast = useToast();
const router = useRouter();

watch(username, (newValue) => {
  if (newValue) {
    localStorage.setItem("username", newValue);
  }
});

onMounted(() => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    username.value = savedName;
    toast.success(`Welcome back, ${savedName}!`, { timeout: 2000 });
  } else {
    toast.success("Welcome to Bomb Party!", { timeout: 2000 });
  }

  fetchGames(); // Load games when the component is mounted
});

const fetchGames = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/game");
    games.value = response.data.games; // Assume the API returns an array of games in `response.data.games`
  } catch (error) {
    console.error("Error fetching games:", error);
    toast.error("Failed to fetch available games.");
  }
};

const joinLobby = (code) => {
  console.log("Joining lobby with code:", code);
  if (!username.value.trim()) {
    toast.error("Please enter your name before joining a lobby!");
    return;
  }
  router.push(`/game/${code}`);
};

const createLobby = async () => {
  const response = await axios.post(
    `http://localhost:3000/api/game/create`,
    { settings: { 
        difficulty: 'beginner',
        language: 'english',
        privateGame: false,
        maxPlayers: 1,
        timer: 10,      
      } 
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    }
  );

  router.push(`/game/${response.data.gameID}`);
};
</script>
