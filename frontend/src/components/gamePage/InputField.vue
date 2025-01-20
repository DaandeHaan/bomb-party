<template>
  <div class="absolute bottom-10 w-full flex flex-col items-center space-y-4">
    <input
      type="text"
      :value="modelValue"
      @input="handleInput"
      placeholder="Enter your word..."
      class="p-3 w-3/4 max-w-md border rounded-lg text-center shadow focus:outline-none focus:ring focus:ring-blue-400"
      @keydown.enter="emit('sendWord')"
      :disabled="!isCurrentPlayer && gameHasStarted"
    />
    <button
      v-if="!gameHasStarted && isYouAndOwner"
      class="bg-green-600 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow hover:bg-green-700 transition"
      @click="emit('gameStart')"
    >
      Start Game
    </button>
    <button
      v-if="!gameHasStarted"
      :class="[currentPlayer?.isReady ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700', 'text-white font-semibold py-2 px-8 rounded-lg shadow transition']"
      @click="emit('toggleReadyUp')"
    >
      {{ currentPlayer?.isReady ? 'Unready' : 'Ready Up' }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String, // Prop for v-model binding
  isCurrentPlayer: Boolean, // Indicates if this is the current player's turn
  gameHasStarted: Boolean, // Game state flag
  isYouAndOwner: Boolean, // Indicates if the player is the owner
  currentPlayer: Object, // Current player's data
});

// Define `emit` for use in `<script setup>`
const emit = defineEmits(['update:modelValue', 'sendWord', 'gameStart', 'toggleReadyUp', 'onType']);

// Input handler for text input
const handleInput = (event) => {
  const value = event.target.value;
  emit('update:modelValue', value); // Emit for v-model binding
  emit('onType', value); // Emit additional 'onType' event
};
</script>
