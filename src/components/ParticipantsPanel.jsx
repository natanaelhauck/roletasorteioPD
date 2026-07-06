import { useRef, useState } from 'react'
import {
  FileUp,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  UserCheck,
  UserMinus,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { getFirstCsvColumn } from '../utils/names'

export default function ParticipantsPanel({
  participants,
  absentParticipants,
  onAdd,
  onRemove,
  onReset,
  onClear,
  onRestoreAbsent,
  onClearAbsent,
  disabled,
}) {
  const [singleName, setSingleName] = useState('')
  const [bulkNames, setBulkNames] = useState('')
  const [mode, setMode] = useState('single')
  const fileInput = useRef(null)

  function submitSingle(event) {
    event.preventDefault()
    if (!singleName.trim()) return
    onAdd([singleName])
    setSingleName('')
  }

  function submitBulk() {
    const names = bulkNames.split(/\r?\n/)
    onAdd(names)
    setBulkNames('')
  }

  async function importCsv(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const content = await file.text()
    const names = content.split(/\r?\n/).map(getFirstCsvColumn)
    onAdd(names)
    event.target.value = ''
  }

  return (
    <section className="panel participants-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow"><Users size={14} /> Lista do sorteio</span>
          <h2>Participantes</h2>
        </div>
        <span className="count-badge">{participants.length}</span>
      </div>

      <div className="input-tabs" role="tablist" aria-label="Forma de adicionar participantes">
        <button
          className={mode === 'single' ? 'active' : ''}
          onClick={() => setMode('single')}
          role="tab"
          aria-selected={mode === 'single'}
          type="button"
        >
          <UserRound size={15} /> Um nome
        </button>
        <button
          className={mode === 'bulk' ? 'active' : ''}
          onClick={() => setMode('bulk')}
          role="tab"
          aria-selected={mode === 'bulk'}
          type="button"
        >
          <Upload size={15} /> Colar lista
        </button>
      </div>

      {mode === 'single' ? (
        <form className="single-input" onSubmit={submitSingle}>
          <label className="sr-only" htmlFor="participant-name">Nome do participante</label>
          <input
            id="participant-name"
            value={singleName}
            onChange={(event) => setSingleName(event.target.value)}
            placeholder="Nome do participante"
            disabled={disabled}
          />
          <button className="icon-action primary" type="submit" disabled={disabled || !singleName.trim()} aria-label="Adicionar participante">
            <Plus size={19} />
          </button>
        </form>
      ) : (
        <div className="bulk-input">
          <label className="sr-only" htmlFor="bulk-names">Um nome por linha</label>
          <textarea
            id="bulk-names"
            value={bulkNames}
            onChange={(event) => setBulkNames(event.target.value)}
            placeholder={'Cole um nome por linha\nEx.: João Silva'}
            disabled={disabled}
          />
          <button className="secondary-button full" type="button" onClick={submitBulk} disabled={disabled || !bulkNames.trim()}>
            <Plus size={16} /> Adicionar lista
          </button>
        </div>
      )}

      <button className="csv-import" type="button" onClick={() => fileInput.current?.click()} disabled={disabled}>
        <FileUp size={16} />
        Importar arquivo CSV
        <span>1ª coluna</span>
      </button>
      <input ref={fileInput} className="sr-only" type="file" accept=".csv,text/csv,text/plain" onChange={importCsv} />

      <div className="participant-list" aria-live="polite">
        {participants.length ? (
          participants.map((name, index) => (
            <div className="participant-row" key={`${name}-${index}`}>
              <span className="participant-index">{String(index + 1).padStart(2, '0')}</span>
              <span title={name}>{name}</span>
              <button type="button" onClick={() => onRemove(index)} disabled={disabled} aria-label={`Remover ${name}`}>
                <X size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Users size={24} />
            <p>Nenhum nome na roda.</p>
            <span>Adicione participantes para começar.</span>
          </div>
        )}
      </div>

      {absentParticipants.length > 0 && (
        <div className="absent-box" aria-live="polite">
          <div className="absent-summary">
            <div>
              <span><UserMinus size={13} /> Ausentes neste evento</span>
              <p>Nomes ausentes não voltam para a roleta em novas importações.</p>
            </div>
            <strong>{absentParticipants.length}</strong>
          </div>

          <div className="absent-list">
            {absentParticipants.map((participant) => (
              <article className="absent-row" key={participant.id}>
                <div>
                  <strong title={participant.name}>{participant.name}</strong>
                  <span title={participant.prize}>{participant.prize || 'Prêmio da vez'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRestoreAbsent(participant.id)}
                  disabled={disabled}
                  aria-label={`Reintegrar ${participant.name} à lista`}
                >
                  <UserCheck size={14} /> Reintegrar
                </button>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="panel-actions">
        <button type="button" onClick={onReset} disabled={disabled}>
          <RotateCcw size={15} /> Usar exemplos
        </button>
        <button type="button" onClick={onClearAbsent} disabled={disabled || !absentParticipants.length}>
          <UserCheck size={15} /> Limpar ausentes
        </button>
        <button type="button" className="danger-text" onClick={onClear} disabled={disabled || !participants.length}>
          <Trash2 size={15} /> Limpar
        </button>
      </div>
    </section>
  )
}
