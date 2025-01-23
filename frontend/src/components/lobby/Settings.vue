<template>
  <div class="settings-container p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-xl font-semibold mb-4">Settings</h2>

    <!-- Difficulty -->
    <div class="mb-4">
      <label for="difficulty" class="block text-gray-700">Difficulty:</label>
      <select
        id="difficulty"
        v-model="settings.difficulty"
        class="mt-2 p-2 border rounded-md w-full bg-gray-50"
      >
        <option v-for="level in difficultyOptions" :key="level" :value="level">
          {{ level }}
        </option>
      </select>
    </div>

    <!-- Language -->
    <div class="mb-4">
      <label for="language" class="block text-gray-700">Language:</label>
      <select
        id="language"
        v-model="settings.language"
        class="mt-2 p-2 border rounded-md w-full bg-gray-50"
      >
        <option v-for="language in languageOptions" :key="language" :value="language">
          {{ language }}
        </option>
      </select>
    </div>

    <!-- Private Game -->
    <div class="mb-4 flex items-center">
      <input
        type="checkbox"
        id="privateGame"
        v-model="settings.privateGame"
        class="mr-2"
      />
      <label for="privateGame" class="text-gray-700">Private Game</label>
    </div>

    <!-- Max Players -->
    <div class="mb-4">
      <label for="maxPlayers" class="block text-gray-700">Max Players:</label>
      <input
        type="number"
        id="maxPlayers"
        v-model="settings.maxPlayers"
        min="2"
        max="20"
        class="mt-2 p-2 border rounded-md w-full bg-gray-50"
      />
    </div>

    <!-- Default Timer -->
    <div class="mb-4">
      <label for="defaultTimer" class="block text-gray-700">Timer (Seconds):</label>
      <input
        type="number"
        id="defaultTimer"
        v-model="settings.defaultTimer"
        min="1"
        max="120"
        class="mt-2 p-2 border rounded-md w-full bg-gray-50"
      />
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

    let difficulty = 'easy'; // Default difficulty
    let language = 'dutch'; // Default language

    if (difficultyOptions.includes(this.config.difficulty)) {
      difficulty = this.config.difficulty;
    }

    if (languageOptions.includes(this.config.language)) {
      language = this.config.language;
    }

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
        this.$emit('update-settings', newSettings); // Emit the updated settings to the parent
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
/* Optional Tailwind customizations can go here */
</style>
