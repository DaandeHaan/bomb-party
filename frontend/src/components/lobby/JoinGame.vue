<template>
  <div class="w-full">
    <img src="/logo.png" alt="Bomb Party" class="w-1/2 mx-auto" />

    <!-- Form -->
    <div class="flex flex-col gap-8 items-center justify-center mt-20">

      <!-- Username -->
      <input id="username" v-model="username" class="border border-primary-accent bg-transparent rounded w-80 h-12 p-2 outline-none text-text" placeholder="Username"></input>

      <!-- Lobby Code -->
      <input v-model="code" class="border border-primary-accent bg-transparent rounded w-80 h-12 p-2 outline-none text-text" placeholder="Lobby Code"></input>

      <!-- Join Lobby -->
      <button @click="joinLobby" class="bg-primary-accent rounded w-80 h-12 p-2 outline-none text-text hover:bg-primary-highlight">Join Game</button>

      <!-- Divider -->
      <div class="flex items-center justify-center w-80">
        <div class="flex-grow border-t border-text"></div>
        <span class="mx-3 text-text">or</span>
        <div class="flex-grow border-t border-text"></div>
      </div>

      <!-- Create Game -->
      <button @click="createLobby" class="bg-secondary-accent rounded w-80 h-12 p-2 outline-none text-text hover:bg-secondary-highlight">Create Game</button>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import axios from "axios";

const emit = defineEmits(["create-lobby"]);

const props = defineProps({
  config: Object,
});


const toast = useToast();
const router = useRouter();

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
  if (!code.value.trim())
    return toast.error("Please enter a valid lobby code.");

  router.push(`/game/${code.value}`);
};


const createLobby = async () => {
  const response = await axios.post(
    `http://localhost:3000/api/game/create`,
    {
      settings: {
        difficulty: props.config.difficulty,
        language: props.config.language,
        privateGame: props.config.privateGame,
        maxPlayers: props.config.maxPlayers,
        defaultTimer: props.config.defaultTimer,
        lives: props.config.lives,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  router.push(`/game/${response.data.gameID}`);
};
</script>