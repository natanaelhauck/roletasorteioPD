import { ArrowRight, CalendarClock, PartyPopper, Sparkles, X } from 'lucide-react'
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

export default function WinnerModal({ result, onClose, onNext, canDrawNext }) {
  useEffect(() => {
    if (!result) return undefined
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [result, onClose])

  if (!result) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
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
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar resultado">
          <X size={20} />
        </button>

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
          <span className="winner-kicker"><Sparkles size={15} /> Vencedor(a)</span>
          <h2 id="winner-title" title={result.winner}>{result.winner}</h2>
          <div className="prize-reveal">
            <span>Ganhou</span>
            <strong>{result.prize || 'Prêmio surpresa'}</strong>
          </div>
          <time className="winner-time" dateTime={result.timestamp}>
            <CalendarClock size={14} />
            {formatResultDate(result.timestamp)}
          </time>

          <div className="winner-actions">
            <button
              className="primary-button next-draw-button"
              type="button"
              onClick={onNext}
              disabled={!canDrawNext}
            >
              Sortear próximo <ArrowRight size={18} />
            </button>
            <button className="close-result-button" type="button" onClick={onClose}>
              Fechar
            </button>
          </div>
          {!canDrawNext && (
            <p className="next-draw-hint">Adicione participantes e prêmios para continuar.</p>
          )}
        </div>
      </div>
    </div>
  )
}
