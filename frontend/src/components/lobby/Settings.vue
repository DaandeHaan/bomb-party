<template>
  <div class="w-full max-w-md mx-auto px-4">
    <h1 class="text-text text-4xl font-bold text-center md:text-5xl select-none">Settings</h1>

    <div class="bg-background w-full border-2 border-border drop-shadow-xl p-6 flex flex-col gap-6 rounded mt-6">
      <div>
        <label for="difficulty" class="text-text opacity-80 text-md font-normal select-none">Difficulty</label>
        <select v-model="settings.difficulty" id="difficulty"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
          <option v-for="option in difficultyOptions" :value="option" :key="option"
            class="bg-background text-text">{{ option }}</option>
        </select>
      </div>

      <div>
        <label for="language" class="text-text opacity-80 text-md font-normal select-none">Language</label>
        <select v-model="settings.language" id="language"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
          <option v-for="option in languageOptions" :value="option" :key="option"
            class="bg-background text-text">{{ option }}</option>
        </select>
      </div>

      <div>
        <label for="maxPlayers" class="text-text opacity-80 text-md font-normal select-none">Max Players</label>
        <input type="number" v-model="settings.maxPlayers" id="maxPlayers"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
      </div>

      <div>
        <label for="timer" class="text-text opacity-80 text-md font-normal select-none">Timer (In seconds)</label>
        <input type="number" v-model="settings.defaultTimer" id="timer"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
      </div>

      <div>
        <label for="lives" class="text-text opacity-80 text-md font-normal select-none">Lives</label>
        <input type="number" v-model="settings.lives" id="lives"
          class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-text opacity-80 text-md font-normal select-none">Publicity</label>
        <div class="flex justify-between">
          <button @click="settings.privateGame = true"
            :class="settings.privateGame ? 'bg-primary-accent' : 'bg-transparent'"
            class="select-none transition-all duration-300 w-1/2 p-2 text-text text-md font-normal border-2 border-primary-accent">
            Private
          </button>
          <button @click="settings.privateGame = false"
            :class="!settings.privateGame ? 'bg-primary-accent' : 'bg-transparent'"
            class="select-none transition-all duration-300 w-1/2 p-2 text-text text-md font-normal border-2 border-primary-accent">
            Public
          </button>
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
        defaultTimer: this.config.timer || 10,
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