# TODO:

# Reviews:
- Responsive [REVIEW_NEEDED]

# Features
- Add more words, like brands etc
- Add logging (Games created, players etc) cool insight info!
- Add privacy agreement
- Give beter feedback on currentPlayer and who are you

- Add sidebar (on mobile) with: (desktop is just buttons)
  - Change settings while in the game (during lobby gameState)
  - Add sound mute
  - Add auto ready
  - Add chat
  - Add used words list

- Add stats:
  - Ongoing time
  - Total words
  - Longest word

# Bugs
- On iphone the `interactive-widget=resizes-content` to stop the keyboard from tripping
- Sometimes hints do occure twice in a row
- Disable keyboard suggestions (Current solution autocapitalize, autocomplete, autocorrect, spellcheck do not work) 
- CopyURL is not allowed, because its a insecure context, this can be fixed once we fully deploy 
- You can still type a second after guessing, causes the letters to appear in the middle.
# Suggestions
- Do we want to fetch public games only on refresh, or also every x seconds?
- Game mode (langueges) with only names, brands etc?
- Point system? (not to determine winner, but based on word length, just for fun)
- Possible words list, for diffucult hints?
- Google advert?
- Remove welcome message? Annoying on mobile...
- Troll Menu?
- New game modes:
  - competative :: Everyone has their own timer, the longer the word, the more the timer decreases of other players
  - verus :: Everyone can type at the same time, who is the fastest (How to win?)

# Events
PLAYER_JOINED               - playerJoined.mp3
PLAYER_LEFT                 - playerLeft.mp3
NOT_ENOUGH_PLAYERS          - shake(#startGameButton) -> toast -> error.mp3
GAME_STARTED                - countdown.mp3 > beep.mp3
GAME_FINISHED_WON           - gameWon.mp3 -> Scale winner
GAME_FINISHED_LOST          - gameLost.mp3 -> Shrink Losers
WORD_NOT_FOUND              - error.mp3 -> Shake player
WORD_FOUND                  - success.mp3
EXCELENT_WORD_FOUND         - excelent.mp3
PLAYER_DIED                 - playerDied.mp3
LIVE_LOST                   - playerLost.mp3
STARTING_GAME_TIMER         - StartTimer
CANCEL_STARTING_GAME_TIMER  - CancelTimer
