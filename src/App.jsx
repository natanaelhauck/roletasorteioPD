import { useCallback, useRef, useState } from 'react'
import {
  Check,
  Gift,
  LoaderCircle,
  MapPin,
  Radio,
  Sparkles,
  Zap,
} from 'lucide-react'
import HistoryPanel from './components/HistoryPanel'
import ParticipantsPanel from './components/ParticipantsPanel'
import PrizeArtwork from './components/PrizeArtwork'
import PrizeQueue from './components/PrizeQueue'
import Wheel from './components/Wheel'
import WinnerModal from './components/WinnerModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import {
  EXAMPLE_PARTICIPANTS,
  mergeUniqueNames,
  normalizeName,
} from './utils/names'
import { createPrize, DEFAULT_PRIZES } from './utils/prizes'

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
  const [prizes, setPrizes] = useLocalStorage(
    `${STORAGE_PREFIX}:prizes`,
    DEFAULT_PRIZES,
  )
  const [removeWinner, setRemoveWinner] = useLocalStorage(
    `${STORAGE_PREFIX}:remove-winner`,
    true,
  )
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winnerResult, setWinnerResult] = useState(null)
  const pendingResult = useRef(null)
  const currentPrize = prizes[0]

  function addParticipants(names) {
    setParticipants((current) => mergeUniqueNames(current, names))
  }

  function removeParticipant(index) {
    setParticipants((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  function addPrize(name) {
    setPrizes((current) => [...current, createPrize(name)])
  }

  function editPrize(id, name) {
    setPrizes((current) =>
      current.map((prize) => (
        prize.id === id
          ? { ...prize, name: name.trim().replace(/\s+/g, ' ') }
          : prize
      )),
    )
  }

  function movePrize(index, direction) {
    setPrizes((current) => {
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= current.length) return current
      const reordered = [...current]
      ;[reordered[index], reordered[targetIndex]] = [
        reordered[targetIndex],
        reordered[index],
      ]
      return reordered
    })
  }

  function spin() {
    if (isSpinning || participants.length < 2 || !currentPrize) return

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
      prize: currentPrize.name,
      prizeId: currentPrize.id,
      prizeImage: currentPrize.image,
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
      prizeImage: result.prizeImage,
      timestamp: new Date().toISOString(),
    }

    setHistory((current) => [historyEntry, ...current])
    setPrizes((current) => current.filter((prize) => prize.id !== result.prizeId))
    if (removeWinner) {
      setParticipants((current) =>
        current.filter((name) => normalizeName(name) !== normalizeName(result.winner)),
      )
    }
    setIsSpinning(false)
    setWinnerResult(historyEntry)
  }, [isSpinning, removeWinner, setHistory, setParticipants, setPrizes])

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand-lockup">
          <div className="logo-frame">
            <img
              className="brand-logo"
              src="/assets/LogoPDhorizontal@2x.png"
              alt="Projeto Desenvolve"
            />
          </div>
          <div className="brand-event-copy">
            <span>Projeto Desenvolve</span>
            <strong><MapPin size={13} /> Itabira</strong>
          </div>
        </div>

        <div className="event-status">
          <span className="live-dot" />
          <div>
            <small><Radio size={12} /> Evento presencial</small>
            <strong>Sorteio ao vivo</strong>
          </div>
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
            <span className="eyebrow"><Sparkles size={14} /> Edição Itabira</span>
            <h1>A roda decide.</h1>
            <p>Um giro, um nome, uma conquista.</p>
          </div>

          <Wheel
            participants={participants}
            rotation={rotation}
            isSpinning={isSpinning}
            onSpinEnd={finishSpin}
          />

          <div className="draw-controls">
            <div className="current-prize-card">
              {currentPrize ? (
                <>
                  <PrizeArtwork
                    image={currentPrize.image}
                    name={currentPrize.name}
                    className="current-prize-art"
                    eager
                  />
                  <div>
                    <span><Gift size={12} /> Prêmio da vez</span>
                    <strong title={currentPrize.name}>{currentPrize.name}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="current-prize-empty"><Gift size={19} /></div>
                  <div>
                    <span>Fila encerrada</span>
                    <strong>Adicione um prêmio</strong>
                  </div>
                </>
              )}
            </div>

            <button
              className="primary-button spin-button"
              type="button"
              onClick={spin}
              disabled={isSpinning || participants.length < 2 || !currentPrize}
            >
              {isSpinning ? (
                <><LoaderCircle className="spin-icon" size={22} /> Girando...</>
              ) : (
                <><Zap size={22} fill="currentColor" /> Sortear</>
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

            {participants.length < 2 && (
              <p className="control-hint">Adicione pelo menos dois participantes.</p>
            )}
            {!currentPrize && (
              <p className="control-hint">Adicione um prêmio à fila para sortear.</p>
            )}
          </div>
        </section>

        <aside className="right-rail">
          <PrizeQueue
            prizes={prizes}
            onAdd={addPrize}
            onEdit={editPrize}
            onMove={movePrize}
            onRemove={(id) => setPrizes((current) => current.filter((prize) => prize.id !== id))}
            onReset={() => setPrizes(DEFAULT_PRIZES)}
            disabled={isSpinning}
          />
          <HistoryPanel
            history={history}
            onClear={() => setHistory([])}
            onExport={() => exportHistoryCsv(history)}
          />
        </aside>
      </main>

      <footer>
        <span>Projeto Desenvolve Itabira</span>
        <i />
        <span>Conectando pessoas ao futuro</span>
      </footer>

      <WinnerModal
        result={winnerResult}
        onClose={() => setWinnerResult(null)}
        onNext={spin}
        canDrawNext={participants.length >= 2 && prizes.length > 0}
      />
    </div>
  )
}
