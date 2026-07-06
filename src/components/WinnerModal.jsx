import {
  CalendarClock,
  PartyPopper,
  Sparkles,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useEffect } from 'react'
import PrizeArtwork from './PrizeArtwork'

const PARTICLES = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${4 + ((index * 17) % 92)}%`,
  delay: `${-((index * 0.13) % 2.2)}s`,
  duration: `${2.2 + (index % 5) * 0.28}s`,
  color: ['#ff2f92', '#8556ff', '#168cff', '#ff9f1a'][index % 4],
}))

function formatResultDate(timestamp) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export default function WinnerModal({
  result,
  onConfirmPresent,
  onMarkAbsent,
  canRedrawAfterAbsent,
}) {
  useEffect(() => {
    if (!result) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Enter') onConfirmPresent()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [result, onConfirmPresent])

  if (!result) return null

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="celebration-particles" aria-hidden="true">
        {PARTICLES.map((particle) => (
          <span
            key={particle.id}
            style={{
              '--particle-left': particle.left,
              '--particle-delay': particle.delay,
              '--particle-duration': particle.duration,
              '--particle-color': particle.color,
            }}
          />
        ))}
      </div>

      <div className="winner-modal" role="dialog" aria-modal="true" aria-labelledby="winner-title">
        <div className="winner-prize-visual">
          <div className="prize-orbit" />
          <PrizeArtwork
            image={result.prizeImage}
            name={result.prize}
            className="winner-prize-art"
            eager
          />
          <span><PartyPopper size={17} /> Prêmio da rodada</span>
        </div>

        <div className="winner-content">
          <span className="winner-kicker"><Sparkles size={15} /> Sorteado(a)</span>
          <h2 id="winner-title" title={result.winner}>{result.winner}</h2>

          <div className="prize-reveal">
            <span>Prêmio da vez</span>
            <strong>{result.prize || 'Prêmio surpresa'}</strong>
          </div>

          <time className="winner-time" dateTime={result.timestamp}>
            <CalendarClock size={14} />
            {formatResultDate(result.timestamp)}
          </time>

          <div className="presence-question">
            <strong>A pessoa está presente no evento?</strong>
            <span>Confirme antes de consumir o prêmio e registrar no histórico.</span>
          </div>

          <div className="winner-actions">
            <button
              className="primary-button confirm-presence-button"
              type="button"
              onClick={onConfirmPresent}
            >
              <UserCheck size={18} /> Sim, entregar prêmio
            </button>
            <button className="absence-button" type="button" onClick={onMarkAbsent}>
              <UserX size={17} />
              Não está presente, sortear novamente
            </button>
          </div>

          {!canRedrawAfterAbsent && (
            <p className="next-draw-hint">
              Se marcar ausência, não haverá participantes ativos para ressortear este prêmio.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
