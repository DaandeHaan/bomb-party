<template>

<div class="w-full border border-secondary-accent p-2 text-text rounded-md">

        <div class="flex justify-between">
          <h3>{{ game.players.find(player => player.isOwner)?.username || "" }}'s lobby</h3>
          <p>{{ game.gameID }}</p>
        </div>

        <div class="flex justify-between">

          <div>
            <p><font-awesome-icon icon="user" class="text-sm" /> {{ game.players.length }} / {{ game.maxPlayers }}</p>

            <div class="flex gap-2">
              <p class="capitalize"><font-awesome-icon icon="globe" class="text-sm" /> {{ game.language }}</p>
              <p class="capitalize"><font-awesome-icon icon="skull" class="text-sm" /> {{ game.diffuculty }}</p>
            </div>

          </div>

          <div class="flex flex-col justify-end">
            <button
              @click="joinLobby(game.gameID)"
              class="bg-primary-accent text-white px-4 py-1 rounded hover:bg-primary-highlight"
            >Join Game</button>
          </div>

        </div>

      </div>

</template>

<script setup>    
defineProps({
  game: {
    type: Object,
    required: true
  }
});

import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const joinLobby = (code) => {
  router.push(`/game/${code}`);
};
</script>
