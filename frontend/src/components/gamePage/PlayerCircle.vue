<template>
  <div id="circle"
    :class="[
    'relative', 
    'md:w-[600px]', 
    'md:h-[600px]', 
    'md:pb-0',
    'w-[350px]',
    'h-[350px]', // Maintain aspect ratio
    'max-w-[600px]', 
    'max-h-[600px]', // Set max dimensions
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
      :style="getPlayerPosition(index, readyPlayers.length)"
      class="absolute"
      id="playerCard"	
    >
      <div :id="player.id" :class="[player.currentPlayer ? 'ring-2 ring-error scale-120' : '', player.lives === 0 ? 'bg-background text-gray-400 opacity-50' : '']" 
            class="max-w-24 min-w-12 md:max-w-96 md:min-w-32 relative flex flex-col items-center text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 bg-background border-2 border-border text-text">

        <!-- Player Lives -->
        <div class="absolute -top-6 text-xs font-medium mb-1 flex gap-1 w-full items-center justify-center">
          <span v-for="i in defaultLives" :key="i" 
                :class="{
                  'text-error': i <= player.lives, 
                  'text-gray-400 opacity-70': i > player.lives
                }">
            <font-awesome-icon icon="heart" class="text-lg" />
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
      class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center bg-gradient-to-r from-[#7AA2F7] to-[#A28DEB] text-[#1E1E2E] text-xs md:text-xl font-bold py-4 px-6 rounded-full shadow-lg"
    >
      🏆 Last Winner 🏆
      <div class="text-sm font-medium">{{ lastWinner.username }}</div>
    </div>

    <!-- Current Hint -->
    <div
      v-else
      class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center bg-gradient-to-r from-[#7AA2F7] to-[#BB9AF7] text-[#1E1E2E] text-4xl font-bold py-6 px-12 rounded-full shadow-lg"
    >
      {{ currentHint }}
    </div>

    <!-- Current Text -->
    <div
      v-if="gameHasStarted"
      class="absolute top-1/2 left-1/2 translate-y-2/4 -translate-x-1/2 flex items-center justify-center text-[#1E1E2E] text-4xl font-bold py-6 px-12"
    >
        <div class="flex max-w-96 overflow-hidden flex-nowrap">
          <span
            v-for="(segment, idx) in getWordHighlights(currentText)"
            :key="idx"
            class="md:text-5xl text-xl leading-tight"
            :class="segment.isHint ? 'text-warning font-semibold' : 'text-[#C8D1E0]'"
          >
            {{ segment.text }}
          </span>
        </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive} from "vue";

const props = defineProps({
  players: Array,
  gameHasStarted: Boolean,
  lastWinner: Object,
  currentHint: String,
  isCurrentPlayer: Boolean, // Indicates if this is the current player's turn
  defaultLives: Number,
  currentText: String,
});


const playerSegments = reactive({});

// Filter players who are ready
const readyPlayers = computed(() =>
  props.players.filter((player) => player.isReady)
);

const getPlayerPosition = (index, totalPlayers) => {
  const angle = (index / totalPlayers) * 360;
  const radius = window.innerWidth < 768 ? 175 : 300;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

const setPlayerPositions = () => {
  const parent = document.getElementById('circle'); // Parent circle container
  const children = parent.querySelectorAll('#playerCard'); // All child divs (players)
  const totalPlayers = children.length;

  children.forEach((child, index) => {
    const angle = (index / totalPlayers) * 360;
    const radius = window.innerWidth < 768 ? 175 : 300;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    // Apply the calculated position to each child div
    child.style.transform = `translate(${x}px, ${y}px)`;
  });
};

const getHighlightedSegments = (word, player) => {
  if (!word || !props.currentHint) return [{ text: word, isHint: false }];

  if (!player.currentPlayer) {
    return playerSegments[player.id] || [{ text: word, isHint: false }];
  }

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
  playerSegments[player.id] = segments;

  return segments;
};

const getWordHighlights = (word) => {
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

  return segments;
};

window.addEventListener('resize', setPlayerPositions);

</script>
