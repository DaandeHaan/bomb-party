<template>
  <div class="w-full flex flex-col items-center gap-12">
    <h1 class="text-text text-5xl font-bold pt-28 text-center">Settings</h1>

    <!-- Panel -->
    <div class="bg-background w-[480px] h-[670px] border-2 border-border drop-shadow-xl p-8 flex flex-col gap-8">

      <!-- Field Difficulty -->
      <div>
        <label for="difficulty" class="text-text opacity-80 text-md font-normal">Difficulty</label>
        <select v-model="settings.difficulty" id="difficulty" class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
          <option v-for="option in difficultyOptions" :value="option" :key="option">{{ option }}</option>
        </select>
      </div>

      <!-- Field Language -->
      <div>
        <label for="language" class="text-text opacity-80 text-md font-normal">Language</label>
        <select v-model="settings.language" id="language" class="w-full p-2 pl-0 text-text bg-transparent border-b border-primary-accent outline-none">
          <option v-for="option in languageOptions" :value="option" :key="option">{{ option }}</option>
        </select>
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
