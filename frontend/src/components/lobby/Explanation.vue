<template>
  <div class="max-h-[calc(100%-8rem)] overflow-scroll">

    <!-- Header -->
    <header class="text-center border-b-2 border-border pb-4 mb-4">
      <h1 class="text-text text-4xl font-bold text-center md:text-5xl select-none">How to play</h1>
    </header>

    <!-- Content -->
    <div class="max-h-[90%] overflow-scroll">
      <p class="font-extrabold text-lg">💣 Welcome to Bomb Party! 💥</p>
      <p>Bomb Party is an exciting and fast-paced word game created by
        <a href="https://github.com/TamiELB" target="_blank" class="underline text-primary-accent">Tami</a>
        and
        <a href="https://github.com/DaandeHaan" target="_blank" class="underline text-primary-accent">Daan</a>.
      </p>

      <br>

      <h2 class="font-extrabold text-lg">Game Objective</h2>
      <p>The goal of the game is to come up with a word that contains a given hint consisting of 2 to 3 letters.</p>
      <br/>

      <h2 class="font-extrabold text-lg">Rules</h2>
      <p class="mb-1">- The letters in the hint must appear in the same order but can be positioned anywhere within your word.</p>
      <p class="mb-1">- You have a few seconds to think of a valid word.</p>
      <p class="mb-1">- If you fail to provide an answer in time, you lose a life.</p>
      <p class="mb-1">- Once you run out of lives, you are eliminated and must wait until the round ends.</p>
      <p class="mb-1">- The last player remaining wins the game.</p>
      <p class="mb-1">- After a correct guess or a time-out, the turn passes to the next player.</p>
      <p class="mb-1">- After a correct guess, the timer speeds up for all players.</p>
      <p class="mb-1">- If a player fails to answer, the timer resets to its default speed.</p>
      <p class="mb-1">- If a player fails to answer, the hint will not change until all players failed, or guessed correctly.</p>
      <p class="mb-1">- Guessing a word with 10 or more characters causes the timer to decrease even faster.</p>
      <p class="mb-1">- Words cannot be guessed more than once.</p>
      <p class="mb-1">- The game uses a public word list, which may exclude certain words, such as plurals.</p>
      <p class="mb-1">- The game is case-insensitive.</p>
      
    </div>


  </div>
</template>