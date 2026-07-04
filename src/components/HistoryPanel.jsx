import { Download, Gift, History, Trash2, Trophy } from 'lucide-react'

function formatDate(timestamp) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export default function HistoryPanel({ history, onClear, onExport }) {
  return (
    <section className="panel history-panel">
      <div className="panel-heading compact">
        <div>
          <span className="eyebrow"><History size={14} /> Resultados</span>
          <h2>Histórico</h2>
        </div>
        <span className="count-badge muted">{history.length}</span>
      </div>

      <div className="history-list">
        {history.length ? (
          history.map((draw, index) => (
            <article className="history-item" key={draw.id}>
              <div className="trophy-icon"><Trophy size={17} /></div>
              <div>
                <strong title={draw.winner}>{draw.winner}</strong>
                <span title={draw.prize}><Gift size={12} /> {draw.prize || 'Prêmio surpresa'}</span>
                <time dateTime={draw.timestamp}>{formatDate(draw.timestamp)}</time>
              </div>
              <span className="draw-number">#{history.length - index}</span>
            </article>
          ))
        ) : (
          <div className="empty-state history-empty">
            <History size={23} />
            <p>Os vencedores aparecerão aqui.</p>
          </div>
        )}
      </div>

      <div className="panel-actions">
        <button type="button" onClick={onExport} disabled={!history.length}>
          <Download size={15} /> Exportar CSV
        </button>
        <button type="button" className="danger-text" onClick={onClear} disabled={!history.length}>
          <Trash2 size={15} /> Limpar
        </button>
      </div>
    </section>
  )
}
