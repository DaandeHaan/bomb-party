<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 class="text-4xl font-bold mb-8">Welcome to Bomb Party!</h1>
    <div class="space-y-6">
      <!-- Input field for user name -->
      <div class="flex flex-col items-center space-y-4">
        <label for="username" class="text-lg font-medium">Enter Your Name:</label>
        <input
          id="username"
          v-model="userName"
          type="text"
          placeholder="Your name"
          class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <LobbyInput @join-lobby="joinLobby" />
      <CreateLobby @create-lobby="createLobby" />
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

const userName = ref("");

const toast = useToast();
const router = useRouter();

watch(userName, (newValue) => {
  if (newValue) {
    localStorage.setItem("userName", newValue);
  }
});

onMounted(() => {
  const savedName = localStorage.getItem("userName");
  if (savedName) {
    userName.value = savedName;
    toast.success(`Welcome back, ${savedName}!`, { timeout: 2000 });
  } else {
    toast.success("Welcome to Bomb Party!", { timeout: 2000 });
  }
});

const joinLobby = (code) => {
  if (!userName.value.trim()) {
    toast.error("Please enter your name before joining a lobby!");
    return;
  }
  router.push(`/game/${code}`);
};


const createLobby = async () => {
  const userName = localStorage.getItem('userName');
  console.log("test");

  const response = await axios.post(`http://localhost:3000/game/create`, {
          params: { userName }
        });

  console.log(response);

  // router.push(`/game/${newLobbyId}`);
};
</script>
