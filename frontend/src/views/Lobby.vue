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
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import LobbyInput from "../components/LobbyInput.vue";
  import CreateLobby from "../components/CreateLobby.vue";
  const userName = new ref('');
  
  const router = useRouter();
  
  const joinLobby = (code) => {
    router.push(`/game/${code}`);
  };
  
  const createLobby = () => {
    const newLobbyId = Math.random().toString(36).substring(7);
    router.push(`/game/${newLobbyId}`);
  };

  import { onMounted } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();


onMounted(() => {
  toast.success("My toast content", {
        timeout: 2000
      });
      console.log("test");
});
</script>
  