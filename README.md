# @tryforge/forge.games

A ForgeScript extension that adds a full suite of interactive mini-games to your Discord bot.

## Games

| Game | Function prefix | Description |
|------|----------------|-------------|
| **Trivia** | `$gameTriviaAnswer`, `$gameNewTrivia` | 35+ built-in Q&A across 7 categories |
| **Wordle** | `$gameWordleGuess`, `$gameNewWordle` | 5-letter word guessing with 🟩🟨⬛ tiles |
| **Math Blitz** | `$gameMathAnswer`, `$gameNewMath` | Addition, multiplication, percentages, squares |
| **Hangman** | `$gameHangmanGuess`, `$gameNewHangman` | Classic letter guessing with ASCII art stages |
| **Scramble** | `$gameScrambleAnswer`, `$gameNewScramble` | Unscramble a shuffled word against the clock |

## Session lifecycle

```
$gameCreate[trivia;medium;30;10]  → creates session, returns session ID
$gameJoin                          → player joins waiting session
$gameStart                         → host starts the game & begins timeout timer
... game-specific functions ...
$gameEnd                           → force-ends and destroys the session
```

## Events

| Event | Fired when |
|-------|------------|
| `gamesSessionCreate` | A new session is created |
| `gamesSessionStart` | The session starts |
| `gamesSessionEnd` | The session ends (via $gameEnd) |
| `gamesSessionTimeout` | The session auto-expires |
| `gamesPlayerJoin` | A player joins |
| `gamesPlayerLeave` | A player leaves |
| `gamesAnswerCorrect` | A correct answer is submitted |
| `gamesAnswerWrong` | A wrong answer is submitted |
| `gamesAnswerTimeout` | No one answered in time |
| `gamesWordleGuess` | A Wordle guess is processed |
| `gamesHangmanGuess` | A Hangman letter is guessed |
| `gamesScrambleAnswer` | A scramble answer is submitted |

## Setup

```ts
import { ForgeClient } from '@tryforge/forgescript'
import { ForgeGames } from '@tryforge/forge.games'

const client = new ForgeClient({
  extensions: [
    new ForgeGames({
      events: ['gamesAnswerCorrect', 'gamesSessionEnd', 'gamesSessionTimeout'],
    })
  ],
  // ...
})
```

## $gameEvent

Inside any event handler command, use `$gameEvent` to access the event payload as JSON.

```
$let[data;$gameEvent]
Correct! <@$jsonGet[$data;userId]> earned $jsonGet[$data;points] points!
```

## License

GPL-3.0
