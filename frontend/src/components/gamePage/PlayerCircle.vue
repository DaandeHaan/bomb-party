<template>
  <div :class="[
    'relative', 
    'w-[600px]', 
    'h-[600px]', 
    'flex', 
    'items-center', 
    'justify-center', 
    'rounded-full', 
    'border-4', 
    'border-[#2A2A40]', 
    'bg-[#1E1E2E]', 
    'shadow-xl', 
    { 'border-success': isCurrentPlayer }
  ]">
  <!-- Players -->
    <div
      v-for="(player, index) in readyPlayers"
      :key="index"
      :style="getPlayerPosition(index, players.length)"
      class="absolute"
    >
      <div :class="[player.currentPlayer ? 'ring-2 ring-error scale-120' : '', player.lives === 0 ? 'bg-background text-gray-400 opacity-50' : '']" class="max-w-96 min-w-32 relative flex flex-col items-center text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 bg-background border-2 border-border text-text">

        <!-- Player Lives -->
        <div class="absolute -top-6 text-xs font-medium mb-1 flex gap-1 w-full items-center justify-center">
          <span v-for="i in defaultLives" :key="i" 
                :class="{
                  'text-error': i <= player.lives, 
                  'text-gray-400 opacity-70': i > player.lives
                }">
            <font-awesome-icon icon="heart" class="text-sm" />
          </span>
        </div>

        <!-- Player Name -->
        <div class="text-md font-bold"
            :class="player.isYou ? 'text-red-500' : ''">
          {{ player.username }}
        </div>

        <!-- Word Segments -->
        <div class="flex max-w-96 overflow-hidden flex-nowrap">
          <span
            v-for="(segment, idx) in getHighlightedSegments(player.currentText, player)"
            :key="idx"
            class="text-sm"
            :class="segment.isHint ? 'text-warning font-semibold' : 'text-[#C8D1E0]'"
          >
            {{ segment.text }}
          </span>
        </div>

      </div>
    </div>

    <!-- Last Winner -->
    <div
      v-if="!gameHasStarted && lastWinner"
      class="absolute flex flex-col items-center bg-gradient-to-r from-[#7AA2F7] to-[#A28DEB] text-[#1E1E2E] text-xl font-bold py-4 px-6 rounded-full shadow-lg"
    >
      🏆 Last Winner 🏆
      <div class="text-lg font-medium">{{ lastWinner.username }}</div>
    </div>

    <!-- Current Hint -->
    <div
      v-else
      class="absolute flex items-center justify-center bg-gradient-to-r from-[#7AA2F7] to-[#BB9AF7] text-[#1E1E2E] text-4xl font-bold py-6 px-12 rounded-full shadow-lg"
    >
      {{ currentHint }}
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";

const props = defineProps({
  players: Array,
  gameHasStarted: Boolean,
  lastWinner: Object,
  currentHint: String,
  isCurrentPlayer: Boolean, // Indicates if this is the current player's turn
  defaultLives: Number,
});

const playerSegments = reactive({});

// Filter players who are ready
const readyPlayers = computed(() =>
  props.players.filter((player) => player.isReady)
);

const getPlayerPosition = (index, totalPlayers) => {
  const angle = (index / totalPlayers) * 360;
  const radius = 300;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

const getHighlightedSegments = (word, player) => {
  if (!word || !props.currentHint) return [{ text: word, isHint: false }];

  const hint = props.currentHint.trim();

  const segments = [];
  let remainingWord = word;

  while (remainingWord.length > 0) {
    if (remainingWord.startsWith(hint)) {
      segments.push({ text: hint, isHint: true });
      remainingWord = remainingWord.slice(hint.length);
    } else {
      const nextNonHintSegment = remainingWord.split(hint, 1)[0];
      segments.push({ text: nextNonHintSegment, isHint: false });
      remainingWord = remainingWord.slice(nextNonHintSegment.length);
    }
  }

  // Cache segments only if necessary, but do it outside of template logic
  if (player.currentPlayer) {
    playerSegments[player.id] = segments;
  }

  return segments;
};
</script>
