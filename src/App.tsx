import { useGameState } from './hooks/useGameState'
import { LobbyScreen } from './screens/LobbyScreen'
import { PlayScreen } from './screens/PlayScreen'
import { OverScreen } from './screens/OverScreen'
import { SoundToggle } from './components/SoundToggle'
import { useSoundEffects } from './hooks/useSoundEffects'
import styles from './App.module.css'

export default function App() {
  const game = useGameState()
  const sound = useSoundEffects()

  return (
    <div className={styles.app}>
      <SoundToggle
        enabled={sound.enabled}
        onToggle={sound.toggle}
        offsetTop={game.screen === 'play' ? 66 : 12}
      />

      {game.screen === 'lobby' && (
        <LobbyScreen
          players={game.players}
          addPlayer={(name, cat, avatar) => {
            sound.play('tap')
            game.addPlayer(name, cat, avatar)
          }}
          removePlayer={(id) => {
            sound.play('wrong')
            game.removePlayer(id)
          }}
          startGame={() => {
            sound.play('start')
            game.startGame()
          }}
        />
      )}

      {game.screen === 'play' && game.question && (
        <PlayScreen
          players={game.players}
          current={game.current}
          question={game.question}
          qNumber={game.qNumber}
          revealed={game.revealed}
          onReveal={() => {
            sound.play('reveal')
            game.reveal()
          }}
          onScore={(pts) => {
            sound.play(pts > 0 ? 'correct' : 'wrong')
            game.score(pts)
          }}
          onEnd={() => {
            sound.play('finale')
            game.endGame()
          }}
        />
      )}

      {game.screen === 'over' && game.punishment && (
        <OverScreen
          players={game.players}
          punishment={game.punishment}
          onRestart={() => {
            sound.play('start')
            game.restart()
          }}
        />
      )}
    </div>
  )
}
