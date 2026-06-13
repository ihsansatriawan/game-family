import { useGameState } from './hooks/useGameState'
import { LobbyScreen } from './screens/LobbyScreen'
import { PlayScreen } from './screens/PlayScreen'
import { OverScreen } from './screens/OverScreen'
import styles from './App.module.css'

export default function App() {
  const game = useGameState()

  return (
    <div className={styles.app}>
      {game.screen === 'lobby' && (
        <LobbyScreen
          players={game.players}
          addPlayer={game.addPlayer}
          removePlayer={game.removePlayer}
          startGame={game.startGame}
        />
      )}

      {game.screen === 'play' && game.question && (
        <PlayScreen
          players={game.players}
          current={game.current}
          question={game.question}
          qNumber={game.qNumber}
          revealed={game.revealed}
          onReveal={game.reveal}
          onScore={game.score}
          onEnd={game.endGame}
        />
      )}

      {game.screen === 'over' && game.punishment && (
        <OverScreen
          players={game.players}
          punishment={game.punishment}
          onRestart={game.restart}
        />
      )}
    </div>
  )
}
