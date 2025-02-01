<template>
  <div class="absolute bottom-10 w-full px-6 gap-4 flex justify-center flex-col">
    <!-- Game Actions -->
    <div class="mt-6 flex justify-center gap-4">
       <!-- Ready Up Button -->
      <button
        v-if="!gameHasStarted"
        @click="$emit('toggleReadyUp')"
        class="w-full md:w-32 py-3 px-6 rounded-lg bg-gradient-to-r from-[#A6E3A1] to-[#BB9AF7] text-[#1E1E2E] font-semibold shadow-md hover:scale-105 transition-all duration-300"
      >
      {{ currentPlayer?.isReady ? 'Unready' : 'Ready Up' }}
      </button>

      <!-- Start Game Button -->
      <button
        id="startGameButton"
        v-if="isYouAndOwner && !gameHasStarted"
        @click="$emit('gameStart')"
        class="w-full md:w-32 py-3 px-6 rounded-lg bg-gradient-to-r from-[#A28DEB] to-[#BB9AF7] text-[#1E1E2E] font-semibold shadow-md hover:scale-105 transition-all duration-300"
      >
        Start Game
      </button>
      
    </div>
    <!-- Input Field and Action Buttons -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-4">
      <!-- Input Field -->
      <input
        ref="alwaysFocusedInput"
        :value="modelValue"
        @input="handleInput"
        @keydown.enter="emit('sendWord')"
        :disabled="!isCurrentPlayer || !gameHasStarted"
        type="text"
        placeholder="Type your word here..."
        class="w-full md:max-w-lg flex-1 py-3 px-4 rounded-lg bg-[#2A2A40] text-[#D9E0EE] placeholder-[#7AA2F7] border border-[#7AA2F7] focus:outline-none focus:ring-2 focus:ring-[#A28DEB] focus:border-transparent transition-all duration-300"
      />

      <!-- Send Word Button -->
      <!-- <button
        @click="$emit('sendWord')"
        :disabled="!modelValue.trim() || !isCurrentPlayer || !gameHasStarted"
        class="py-3 px-6 rounded-lg bg-gradient-to-r from-[#7AA2F7] to-[#BB9AF7] text-[#1E1E2E] font-semibold shadow-md hover:scale-105 disabled:opacity-50 transition-all duration-300"
      >
        Send Word
      </button> -->
    </div>
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
