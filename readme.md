TODO:

- Fix the message query in the lobby (url)
- Responsive [IN_PROGRESS]
- Fix the side-panels (settings and availableGames) not being centerd
- Add explenation about the game somewhere
- Change settings while in the game (during lobby gameState)
- Add sound mute
- Add auto ready
- Add more words, like brands etc
- Add logging (Games created, players etc) cool insight info!
- Add privacy agreement
- Add cron to delete empty games every x minutes
- Add chat
- Lose sound being played when winning
- Add used words list
- Point system?
- Possible words list
- Back to lobby
- make '(wins)' darker color 
- sound too loud (win sound)
- green outline if its your turn (whole screen neo green)
- center-text overflow when typing in the circle

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
