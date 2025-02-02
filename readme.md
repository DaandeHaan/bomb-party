# TODO:

# Reviews:
- Responsive [REVIEW_NEEDED]

# Features
- Add sidebar (on mobile) with: (desktop is just buttons)
  - Change settings while in the game (during lobby gameState)
  - Add sound mute
  - Add auto ready
  - Add chat
  - Add used words list

- Add more words, like brands etc
- Add logging (Games created, players etc) cool insight info!
- Add privacy agreement
- Disable keyboard suggestions
- When user is 'not in time' do a last check, to see if the word they currently have typed is a valid word.
- Disable translations (Maybe add our own?)
- Update Icon
- Give beter feedback on currentPlayer and who are you

- Add stats:
  - Ongoing time
  - Total words
  - Longest word

# Bugs
None

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
