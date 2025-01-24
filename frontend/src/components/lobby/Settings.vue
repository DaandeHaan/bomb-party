<template>
  <div class="w-full flex flex-col items-center gap-12">
    <h1 class="text-text text-5xl font-bold pt-28 text-center">Settings</h1>

    <!-- Panel -->
    <div class="bg-background w-[480px] border-2 border-border drop-shadow-xl p-8 flex flex-col gap-8 rounded">

      <!-- Field Difficulty -->
      <div>
        <label for="difficulty" class="text-text opacity-80 text-md font-normal">Difficulty</label>
        <select v-model="settings.difficulty" id="difficulty" class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
          <option v-for="option in difficultyOptions" :value="option" :key="option" class="bg-background text-text">{{ option }}</option>
        </select>
      </div>

      <!-- Field Language -->
      <div>
        <label for="language" class="text-text opacity-80 text-md font-normal">Language</label>
        <select v-model="settings.language" id="language" class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
          <option v-for="option in languageOptions" :value="option" :key="option" class="bg-background text-text">{{ option }}</option>
        </select>
      </div>

      <!-- Field MaxPlayers -->
      <div>
        <label for="maxPlayers" min='2' class="text-text opacity-80 text-md font-normal">Max Players</label>
        <input type="number" v-model="settings.maxPlayers" id="maxPlayers" class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none"></input>
      </div>

      <!-- Field Timer -->
      <div>
        <label for="timer" class="text-text opacity-80 text-md font-normal">Timer (In seconds)</label>
        <input type="number" v-model="settings.defaultTimer" id="timer" class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none"></input>
      </div>

      <!-- Field Lives -->
      <div>
        <label for="lives" class="text-text opacity-80 text-md font-normal">Lives</label>
        <input type="number" v-model="settings.lives" id="lives" class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none"></input>
      </div>


      <!-- Buttons Private Game -->
      <div class="flex justify-between flex-col gap-2">
        <label for="timer" class="text-text opacity-80 text-md font-normal">Publicity</label>
        <div class="flex justify-between">
          <button @click="settings.privateGame = true" :class="settings.privateGame ? 'bg-primary-accent' : 'bg-transparent' " class="transition-all duration-300 w-[48%] p-2 text-text text-md font-normal border-2 border-primary-accent">Private</button>
          <button @click="settings.privateGame = false" :class="!settings.privateGame ? 'bg-primary-accent' : 'bg-transparent' " class="transition-all duration-300 w-[48%] p-2 text-text text-md font-normal border-2 border-primary-accent">Public</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    const difficultyOptions = ['baby', 'beginner', 'easy', 'medium', 'hard', 'expert', 'hardcore'];
    const languageOptions = ['dutch', 'english'];

    let difficulty = this.config.difficulty || 'easy';
    let language = this.config.language || 'dutch';

    return {
      difficultyOptions,
      languageOptions,
      settings: {
        difficulty,
        language,
        privateGame: this.config.privateGame || false,
        maxPlayers: this.config.maxPlayers || 8,
        defaultTimer: this.config.defaultTimer || 10,
        lives: this.config.lives || 2,
      },
    };
  },
  watch: {
    settings: {
      handler(newSettings) {
        this.$emit('update', newSettings); // Emit the updated settings to the parent
      },
      deep: true, // Watch deeply for nested changes
    },
  },
};
</script>

<style scoped>
/* Optional Tailwind customizations can go here */
</style>
