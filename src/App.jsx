import { useCallback, useRef, useState } from 'react'
import {
  Check,
  Gift,
  LoaderCircle,
  MapPin,
  Sparkles,
  Zap,
} from 'lucide-react'
import HistoryPanel from './components/HistoryPanel'
import ParticipantsPanel from './components/ParticipantsPanel'
import Wheel from './components/Wheel'
import WinnerModal from './components/WinnerModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import {
  EXAMPLE_PARTICIPANTS,
  mergeUniqueNames,
  normalizeName,
} from './utils/names'

const STORAGE_PREFIX = 'roleta-pd'

function escapeCsv(value) {
  const text = String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

function exportHistoryCsv(history) {
  const header = ['Vencedor', 'Prêmio', 'Data e hora']
  const rows = history.map((item) => [
    item.winner,
    item.prize || 'Prêmio surpresa',
    new Date(item.timestamp).toLocaleString('pt-BR'),
  ])
  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(';'))
    .join('\r\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `historico-roleta-pd-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const [participants, setParticipants] = useLocalStorage(
    `${STORAGE_PREFIX}:participants`,
    EXAMPLE_PARTICIPANTS,
  )
  const [history, setHistory] = useLocalStorage(`${STORAGE_PREFIX}:history`, [])
  const [prize, setPrize] = useLocalStorage(`${STORAGE_PREFIX}:prize`, 'Mouse gamer')
  const [removeWinner, setRemoveWinner] = useLocalStorage(
    `${STORAGE_PREFIX}:remove-winner`,
    true,
  )
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winnerResult, setWinnerResult] = useState(null)
  const pendingResult = useRef(null)

  function addParticipants(names) {
    setParticipants((current) => mergeUniqueNames(current, names))
  }

  function removeParticipant(index) {
    setParticipants((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  function spin() {
    if (isSpinning || participants.length < 2) return

    const randomValues = new Uint32Array(1)
    window.crypto.getRandomValues(randomValues)
    const winnerIndex = randomValues[0] % participants.length
    const winner = participants[winnerIndex]
    const segmentAngle = 360 / participants.length
    const desiredRotation = (360 - winnerIndex * segmentAngle) % 360
    const currentNormalized = ((rotation % 360) + 360) % 360
    const alignment = (desiredRotation - currentNormalized + 360) % 360
    const turns = 6 + (randomValues[0] % 3)

    pendingResult.current = {
      winner,
      prize: prize.trim(),
      index: winnerIndex,
    }
    setWinnerResult(null)
    setIsSpinning(true)
    setRotation((current) => current + turns * 360 + alignment)
  }

  const finishSpin = useCallback(() => {
    if (!isSpinning || !pendingResult.current) return

    const result = pendingResult.current
    pendingResult.current = null
    const historyEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      winner: result.winner,
      prize: result.prize,
      timestamp: new Date().toISOString(),
    }

    setHistory((current) => [historyEntry, ...current])
    if (removeWinner) {
      setParticipants((current) =>
        current.filter((name) => normalizeName(name) !== normalizeName(result.winner)),
      )
    }
    setIsSpinning(false)
    setWinnerResult(historyEntry)
  }, [isSpinning, removeWinner, setHistory, setParticipants])

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <img
          className="brand-logo"
          src="/assets/LogoPDhorizontal@2x.png"
          alt="Projeto Desenvolve"
        />
        <div className="event-pill">
          <span className="live-dot" />
          <span>Sorteio ao vivo</span>
          <i />
          <MapPin size={14} />
          <span>Itabira</span>
        </div>
      </header>

      <main className="dashboard">
        <ParticipantsPanel
          participants={participants}
          onAdd={addParticipants}
          onRemove={removeParticipant}
          onReset={() => setParticipants(EXAMPLE_PARTICIPANTS)}
          onClear={() => setParticipants([])}
          disabled={isSpinning}
        />

        <section className="draw-area">
          <div className="draw-heading">
            <span className="eyebrow"><Sparkles size={14} /> Hora de descobrir</span>
            <h1>Quem leva o prêmio?</h1>
            <p>A sorte está lançada. Boa sorte, devs!</p>
          </div>

          <Wheel
            participants={participants}
            rotation={rotation}
            isSpinning={isSpinning}
            onSpinEnd={finishSpin}
          />

          <div className="draw-controls">
            <label className="prize-field">
              <Gift size={18} />
              <span>Prêmio da rodada</span>
              <input
                value={prize}
                onChange={(event) => setPrize(event.target.value)}
                placeholder="Ex.: Fone bluetooth"
                disabled={isSpinning}
              />
            </label>

            <button
              className="primary-button spin-button"
              type="button"
              onClick={spin}
              disabled={isSpinning || participants.length < 2}
            >
              {isSpinning ? (
                <><LoaderCircle className="spin-icon" size={20} /> Girando...</>
              ) : (
                <><Zap size={20} fill="currentColor" /> Sortear</>
              )}
            </button>

            <label className="winner-toggle">
              <input
                type="checkbox"
                checked={removeWinner}
                onChange={(event) => setRemoveWinner(event.target.checked)}
                disabled={isSpinning}
              />
              <span className="custom-check"><Check size={13} /></span>
              Remover vencedor da próxima rodada
            </label>

            {participants.length === 1 && (
              <p className="control-hint">Adicione pelo menos mais um participante.</p>
            )}
          </div>
        </section>

        <HistoryPanel
          history={history}
          onClear={() => setHistory([])}
          onExport={() => exportHistoryCsv(history)}
        />
      </main>

      <footer>
        <span>Projeto Desenvolve</span>
        <i />
        <span>Conectando pessoas ao futuro</span>
      </footer>

      <WinnerModal result={winnerResult} onClose={() => setWinnerResult(null)} />
    </div>
  )
}
