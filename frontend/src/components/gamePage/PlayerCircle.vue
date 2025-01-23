<template>
  <div class="relative w-[600px] h-[600px] flex items-center justify-center rounded-full border-4 border-gray-300 bg-white shadow-lg">
    <!-- Ready Players -->
    <div
      v-for="(player, index) in readyPlayers"
      :style="getPlayerPosition(index, players.length)"
      :class="[ 
        'absolute text-sm font-semibold py-2 px-4 rounded-lg shadow text-center',
        player.currentPlayer ? 'bg-green-500 text-white' : 'bg-gray-300',
        player.isYou ? 'border-2 border-red-600' : '',
        player.lives === 0 ? 'bg-gray-500 text-white' : ''
      ]"
    >
      <!-- Display the segmented word above the player -->
      <div class="mb-2">
        <span
          v-for="(segment, idx) in getHighlightedSegments(player.currentText, player)"
          :key="idx"
          :class="segment.isHint ? 'text-orange-500 font-bold' : 'text-black'"
        >
          {{ segment.text }}
        </span>
      </div>

      <!-- Display player's lives -->
      <div class="text-xs font-medium text-gray-600 mb-1">
        <span v-for="i in player.lives" :key="i" class="text-red-500">❤️</span>
      </div>
      
      <!-- Display player's username -->
      <div class="text-xs font-medium text-gray-600">
        {{ player.username }}
      </div>
    </div>

    <!-- Last Winner -->
    <div
      v-if="!gameHasStarted && lastWinner"
      class="absolute flex flex-col items-center bg-yellow-500 text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg text-center"
    >
      🏆 Last Winner 🏆
      <div class="text-lg font-medium">{{ lastWinner.username }}</div>
    </div>

    <!-- Letters in the middle -->
    <div
      v-else
      class="relative flex flex-col items-center bg-blue-500 text-white text-4xl font-bold py-6 px-12 rounded-full shadow-lg text-center"
    >
      {{ currentHint }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  players: Array, // List of players
  gameHasStarted: Boolean, // Whether the game has started
  lastWinner: Object, // Last winner's information
  currentHint: String, // Current hint string
});

// Filter players who are ready
const readyPlayers = computed(() => {
  return props.players.filter((player) => player.isReady);
});

// Calculate positions for players in a circular layout
const getPlayerPosition = (index, totalPlayers) => {
  const angle = (index / totalPlayers) * 360;
  const radius = 300; // Circle radius
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

const getHighlightedSegments = (word, player) => {
  // For non-current players, return their stored staticSegments
  if (!player.currentPlayer) {
    return player.staticSegments || [{ text: word, isHint: false }];
  }

  // If currentPlayer, process the word dynamically
  if (!word || !props.currentHint) return [{ text: word, isHint: false }];

  const hint = props.currentHint.trim(); // Remove any extra spaces or newline characters
  const segments = [];
  let remainingWord = word;

  // console.log(`Processing word: "${word}" for currentPlayer with hint: "${hint}"`);

  while (remainingWord.length > 0) {
    if (remainingWord.startsWith(hint)) {
      segments.push({ text: hint, isHint: true });
      remainingWord = remainingWord.slice(hint.length);
    } else {
      const nextNonHintSegment = remainingWord.split(hint, 1)[0]; // Take up to the first hint match
      segments.push({ text: nextNonHintSegment, isHint: false });
      remainingWord = remainingWord.slice(nextNonHintSegment.length);
    }
  }

  // Update the player's staticSegments after processing
  player.staticSegments = segments;

  // console.log(`Segments for "${word}":`, segments);
  return segments;
};
</script>
