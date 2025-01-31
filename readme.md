TODO:

- Fix the message query in the lobby
- Responsive
- Other player's typing is not cleared when word is wrong
- Input not being cleared correctly?
- Make timer reduce by %, with more % the longer the word
- Add explenatie about the game somewhere
- Change settings while in the game
- Add sound mute
- Bigger timer text
- Add auto ready
- Add more words, like brands etc

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
