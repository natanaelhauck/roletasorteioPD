import {
  ArrowDown,
  ArrowUp,
  Check,
  Gift,
  Pencil,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react'
import { useState } from 'react'
import PrizeArtwork from './PrizeArtwork'

export default function PrizeQueue({
  prizes,
  onAdd,
  onEdit,
  onMove,
  onRemove,
  onReset,
  disabled,
}) {
  const [newPrize, setNewPrize] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const currentPrize = prizes[0]

  function submitNewPrize(event) {
    event.preventDefault()
    if (!newPrize.trim()) return
    onAdd(newPrize)
    setNewPrize('')
  }

  function startEditing(prize) {
    setEditingId(prize.id)
    setEditingName(prize.name)
  }

  function saveEditing() {
    if (!editingName.trim()) return
    onEdit(editingId, editingName)
    setEditingId(null)
    setEditingName('')
  }

  return (
    <section className="panel prizes-panel">
      <div className="panel-heading prize-heading">
        <div>
          <span className="eyebrow"><Gift size={14} /> Fila do evento</span>
          <h2>Prêmios</h2>
        </div>
        <span className="count-badge prize-count">
          <strong>{prizes.length}</strong>
          <small>restantes</small>
        </span>
      </div>

      {currentPrize ? (
        <div className="next-prize">
          <PrizeArtwork
            image={currentPrize.image}
            name={currentPrize.name}
            className="next-prize-art"
            eager
          />
          <div>
            <span>Próximo prêmio</span>
            <strong title={currentPrize.name}>{currentPrize.name}</strong>
          </div>
        </div>
      ) : (
        <div className="next-prize empty-prize">
          <Gift size={20} />
          <div>
            <span>Fila vazia</span>
            <strong>Adicione um prêmio</strong>
          </div>
        </div>
      )}

      <form className="add-prize-form" onSubmit={submitNewPrize}>
        <label className="sr-only" htmlFor="new-prize">Nome do novo prêmio</label>
        <input
          id="new-prize"
          value={newPrize}
          onChange={(event) => setNewPrize(event.target.value)}
          placeholder="Adicionar prêmio manualmente"
          disabled={disabled}
        />
        <button
          className="icon-action prize-add"
          type="submit"
          disabled={disabled || !newPrize.trim()}
          aria-label="Adicionar prêmio"
        >
          <Plus size={18} />
        </button>
      </form>

      <div className="prize-list" aria-live="polite">
        {prizes.map((prize, index) => (
          <div
            className={`prize-row ${index === 0 ? 'is-next' : ''}`}
            key={prize.id}
          >
            <span className="queue-position">{String(index + 1).padStart(2, '0')}</span>

            {editingId === prize.id ? (
              <div className="prize-edit">
                <input
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setEditingId(null)
                  }}
                  autoFocus
                />
                <button type="button" onClick={saveEditing} aria-label="Salvar nome">
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <span className="prize-name" title={prize.name}>{prize.name}</span>
            )}

            <div className="prize-row-actions">
              <button
                type="button"
                onClick={() => onMove(index, -1)}
                disabled={disabled || index === 0}
                aria-label={`Mover ${prize.name} para cima`}
                title="Mover para cima"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => onMove(index, 1)}
                disabled={disabled || index === prizes.length - 1}
                aria-label={`Mover ${prize.name} para baixo`}
                title="Mover para baixo"
              >
                <ArrowDown size={13} />
              </button>
              <button
                type="button"
                onClick={() => startEditing(prize)}
                disabled={disabled}
                aria-label={`Editar ${prize.name}`}
                title="Editar"
              >
                <Pencil size={13} />
              </button>
              <button
                type="button"
                onClick={() => onRemove(prize.id)}
                disabled={disabled}
                aria-label={`Remover ${prize.name}`}
                title="Remover"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-actions prize-footer">
        <span>{prizes.length === 1 ? '1 sorteio disponível' : `${prizes.length} sorteios disponíveis`}</span>
        <button type="button" onClick={onReset} disabled={disabled}>
          <RotateCcw size={14} /> Restaurar padrão
        </button>
      </div>
    </section>
  )
}
