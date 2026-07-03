import { Gift, PartyPopper, Sparkles, X } from 'lucide-react'
import { useEffect } from 'react'

export default function WinnerModal({ result, onClose }) {
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
      <div className="winner-modal" role="dialog" aria-modal="true" aria-labelledby="winner-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar resultado">
          <X size={20} />
        </button>
        <div className="confetti confetti-one" />
        <div className="confetti confetti-two" />
        <div className="confetti confetti-three" />
        <div className="winner-icon"><PartyPopper size={29} /></div>
        <span className="winner-kicker"><Sparkles size={14} /> Temos um vencedor!</span>
        <h2 id="winner-title">{result.winner}</h2>
        <div className="prize-reveal">
          <Gift size={18} />
          <span>leva</span>
          <strong>{result.prize || 'Prêmio surpresa'}</strong>
        </div>
        <button className="primary-button modal-button" type="button" onClick={onClose}>
          Continuar sorteio
        </button>
      </div>
    </div>
  )
}
