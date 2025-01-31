<template>
  <div class="w-full max-w-md mx-auto px-4">
    <img src="/logo.png" alt="Bomb Party" class="w-1/2 mx-auto" />

    <div class="flex flex-col gap-6 items-center justify-center mt-10">
      <div class="flex flex-col w-full">
        <label class="text-text">Username <span :class="username.length == 20 && 'text-red-400'">({{ username.length }}/20)</span></label>
        <input id="username" v-model="username" maxlength="20"
          class="border border-primary-accent bg-transparent rounded w-full h-12 p-2 outline-none text-text"
          placeholder="Username">
      </div>

      <div class="flex flex-col w-full">
        <label class="text-text">Lobby Code</label>
        <input v-model="code"
          class="border border-primary-accent bg-transparent rounded w-full h-12 p-2 outline-none text-text"
          placeholder="Lobby Code">
      </div>

      <button @click="joinLobby"
        class="bg-primary-accent rounded w-full h-12 p-2 outline-none text-text hover:bg-primary-highlight">
        Join Game
      </button>

      <div class="flex items-center justify-center w-full">
        <div class="flex-grow border-t border-text"></div>
        <span class="mx-3 text-text">or</span>
        <div class="flex-grow border-t border-text"></div>
      </div>

      <button @click="createLobby"
        class="bg-secondary-accent rounded w-full h-12 p-2 outline-none text-text hover:bg-secondary-highlight">
        Create Game
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import axios from "axios";

const emit = defineEmits(["create-lobby"]);
const router = useRouter();
const toast = useToast();
const username = ref("");
const code = ref("");

watch(username, (newValue) => {
  localStorage.setItem("username", newValue);
});

onMounted(() => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    username.value = savedName;
    toast.success(`Welcome back, ${savedName}!`, { timeout: 2000 });
  } else {
    toast.success("Welcome to Bomb Party!", { timeout: 2000 });
  }
});

const joinLobby = () => {
  if (!code.value.trim()) return toast.error("Please enter a valid lobby code.");
  router.push(`/game/${code.value}`);
};

const createLobby = async () => {
  const response = await axios.post("http://localhost:3000/api/game/create", {
    settings: {
      difficulty: "easy",
      language: "dutch",
      privateGame: false,
      maxPlayers: 8,
      defaultTimer: 10,
      lives: 2,
    }
  }, { withCredentials: true });

  router.push(`/game/${response.data.gameID}`);
};
</script>
