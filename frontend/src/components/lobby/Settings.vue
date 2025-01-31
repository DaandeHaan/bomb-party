<template>
  <div class="w-full max-w-md mx-auto px-4">
    <h1 class="text-text text-4xl font-bold pt-12 text-center md:text-5xl">Settings</h1>

    <div class="bg-background w-full border-2 border-border drop-shadow-xl p-6 flex flex-col gap-6 rounded mt-6">
      <div>
        <label for="difficulty" class="text-text opacity-80 text-md font-normal">Difficulty</label>
        <select v-model="settings.difficulty" id="difficulty"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
          <option v-for="option in difficultyOptions" :value="option" :key="option"
            class="bg-background text-text">{{ option }}</option>
        </select>
      </div>

      <div>
        <label for="language" class="text-text opacity-80 text-md font-normal">Language</label>
        <select v-model="settings.language" id="language"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
          <option v-for="option in languageOptions" :value="option" :key="option"
            class="bg-background text-text">{{ option }}</option>
        </select>
      </div>

      <div>
        <label for="maxPlayers" class="text-text opacity-80 text-md font-normal">Max Players</label>
        <input type="number" v-model="settings.maxPlayers" id="maxPlayers"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
      </div>

      <div>
        <label for="timer" class="text-text opacity-80 text-md font-normal">Timer (In seconds)</label>
        <input type="number" v-model="settings.defaultTimer" id="timer"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
      </div>

      <div>
        <label for="lives" class="text-text opacity-80 text-md font-normal">Lives</label>
        <input type="number" v-model="settings.lives" id="lives"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-text opacity-80 text-md font-normal">Publicity</label>
        <div class="flex justify-between">
          <button @click="settings.privateGame = true"
            :class="settings.privateGame ? 'bg-primary-accent' : 'bg-transparent'"
            class="transition-all duration-300 w-1/2 p-2 text-text text-md font-normal border-2 border-primary-accent">
            Private
          </button>
          <button @click="settings.privateGame = false"
            :class="!settings.privateGame ? 'bg-primary-accent' : 'bg-transparent'"
            class="transition-all duration-300 w-1/2 p-2 text-text text-md font-normal border-2 border-primary-accent">
            Public
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({ config: Object });

const difficultyOptions = ["baby", "beginner", "easy", "medium", "hard", "expert", "hardcore"];
const languageOptions = ["dutch", "english"];

const settings = reactive({ ...props.config });

defineEmits(["update"]);
</script>
