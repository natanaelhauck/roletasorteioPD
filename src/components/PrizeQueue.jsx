import {
  ArrowDown,
  ArrowUp,
  Check,
  Gift,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useState } from 'react'
import PrizeArtwork from './PrizeArtwork'

const ACCEPTED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
])
const MAX_IMAGE_DIMENSION = 900
const MAX_SOURCE_SIZE = 12 * 1024 * 1024
const MAX_STORED_IMAGE_LENGTH = 260000

function compressPrizeImage(file) {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      reject(new Error('Use uma imagem PNG, JPG, JPEG, WEBP ou AVIF.'))
      return
    }
    if (file.size > MAX_SOURCE_SIZE) {
      reject(new Error('A imagem deve ter no máximo 12 MB antes do ajuste.'))
      return
    }

    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      try {
        const sourceDimension = Math.max(image.naturalWidth, image.naturalHeight)
        let targetDimension = Math.min(MAX_IMAGE_DIMENSION, sourceDimension)
        let quality = 0.82
        let compressedImage = ''

        for (let attempt = 0; attempt < 8; attempt += 1) {
          const scale = Math.min(1, targetDimension / sourceDimension)
          const width = Math.max(1, Math.round(image.naturalWidth * scale))
          const height = Math.max(1, Math.round(image.naturalHeight * scale))
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const context = canvas.getContext('2d')
          if (!context) throw new Error('Não foi possível ajustar essa imagem.')
          context.drawImage(image, 0, 0, width, height)
          compressedImage = canvas.toDataURL('image/webp', quality)

          if (compressedImage.length <= MAX_STORED_IMAGE_LENGTH) break
          if (quality > 0.58) {
            quality -= 0.1
          } else {
            targetDimension = Math.max(480, Math.round(targetDimension * 0.8))
          }
        }

        URL.revokeObjectURL(objectUrl)
        resolve(compressedImage)
      } catch (error) {
        URL.revokeObjectURL(objectUrl)
        reject(error)
      }
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Não foi possível processar essa imagem.'))
    }

    image.src = objectUrl
  })
}

export default function PrizeQueue({
  prizes,
  templates = [],
  onAdd,
  onEdit,
  onMove,
  onRemove,
  onReset,
  disabled,
}) {
  const [newPrize, setNewPrize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [newImage, setNewImage] = useState(null)
  const [imageName, setImageName] = useState('')
  const [formError, setFormError] = useState('')
  const [processingImage, setProcessingImage] = useState(false)
  const [editingImageId, setEditingImageId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const currentPrize = prizes[0]

  async function prepareImage(file) {
    if (!file) return
    setFormError('')
    setProcessingImage(true)

    try {
      const compressedImage = await compressPrizeImage(file)
      setNewImage(compressedImage)
      setImageName(file.name)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setProcessingImage(false)
    }
  }

  async function replacePrizeImage(prizeId, file) {
    if (!file) return
    setFormError('')
    setEditingImageId(prizeId)

    try {
      const compressedImage = await compressPrizeImage(file)
      onEdit(prizeId, { image: compressedImage })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setEditingImageId(null)
    }
  }

  function submitNewPrize(event) {
    event.preventDefault()
    if (!newPrize.trim()) return

    onAdd(
      {
        name: newPrize,
        image: newImage,
      },
      quantity,
    )
    setNewPrize('')
    setQuantity(1)
    setNewImage(null)
    setImageName('')
    setFormError('')
  }

  function useTemplate(template) {
    setNewPrize(template.name)
    setNewImage(template.image)
    setImageName('Imagem do modelo')
    setFormError('')
  }

  function startEditing(prize) {
    setEditingId(prize.id)
    setEditingName(prize.name)
  }

  function saveEditing() {
    if (!editingName.trim()) return
    onEdit(editingId, { name: editingName })
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
            <strong>Cadastre os prêmios deste evento</strong>
          </div>
        </div>
      )}

      <form className="prize-registration" onSubmit={submitNewPrize}>
        <div className="prize-form-grid">
          <label className="prize-name-field">
            <span>Nome do prêmio</span>
            <input
              value={newPrize}
              onChange={(event) => setNewPrize(event.target.value)}
              placeholder="Ex.: Mouse gamer"
              disabled={disabled}
            />
          </label>

          <label className="prize-quantity-field">
            <span>Quantidade</span>
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled={disabled}
            />
          </label>
        </div>

        <div className="prize-upload-row">
          <PrizeArtwork
            image={newImage}
            name={newPrize || 'Novo prêmio'}
            className="prize-upload-preview"
          />
          <div className="prize-upload-copy">
            <label className={`prize-upload-button ${processingImage ? 'is-loading' : ''}`}>
              <ImagePlus size={15} />
              {processingImage ? 'Ajustando imagem...' : 'Escolher imagem'}
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.avif,image/png,image/jpeg,image/webp,image/avif"
                onChange={(event) => prepareImage(event.target.files?.[0])}
                disabled={disabled || processingImage}
              />
            </label>
            {newImage && (
              <button
                className="remove-upload-button"
                type="button"
                onClick={() => {
                  setNewImage(null)
                  setImageName('')
                }}
                disabled={disabled}
              >
                <X size={13} /> Remover foto
              </button>
            )}
            {imageName && <small className="selected-image-name" title={imageName}>{imageName}</small>}
            <small>Use uma imagem quadrada ou horizontal, de preferência até 1 MB. O sistema ajusta o enquadramento automaticamente.</small>
          </div>
        </div>

        <div className="prize-templates">
          <span>Modelos rápidos</span>
          <div>
            {templates.map((template) => (
              <button
                key={template.name}
                type="button"
                onClick={() => useTemplate(template)}
                disabled={disabled}
                title={`Usar modelo ${template.name}`}
              >
                <PrizeArtwork
                  image={template.image}
                  name={template.name}
                  className="prize-template-art"
                />
                <span>{template.name}</span>
              </button>
            ))}
          </div>
        </div>

        {formError && <p className="prize-form-error">{formError}</p>}

        <button
          className="add-prize-button"
          type="submit"
          disabled={disabled || processingImage || !newPrize.trim()}
        >
          <Plus size={17} />
          Adicionar {Number(quantity) > 1 ? `${quantity} itens` : 'à fila'}
        </button>
      </form>

      <div className="prize-list" aria-live="polite">
        {prizes.length ? prizes.map((prize, index) => (
          <div
            className={`prize-row ${index === 0 ? 'is-next' : ''}`}
            key={prize.id}
          >
            <span className="queue-position">{String(index + 1).padStart(2, '0')}</span>
            <PrizeArtwork
              image={prize.image}
              name={prize.name}
              className="prize-row-art"
            />

            {editingId === prize.id ? (
              <div className="prize-edit">
                <input
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') saveEditing()
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
              <label
                className={`prize-image-edit ${editingImageId === prize.id ? 'is-loading' : ''}`}
                title="Trocar foto"
              >
                <Upload size={13} />
                <span className="sr-only">Trocar foto de {prize.name}</span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.avif,image/png,image/jpeg,image/webp,image/avif"
                  onChange={(event) => replacePrizeImage(prize.id, event.target.files?.[0])}
                  disabled={disabled || editingImageId === prize.id}
                />
              </label>
              <button
                type="button"
                onClick={() => startEditing(prize)}
                disabled={disabled}
                aria-label={`Editar ${prize.name}`}
                title="Editar nome"
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
        )) : (
          <div className="prize-list-empty">
            <Gift size={20} />
            <span>Nenhum prêmio na fila.</span>
          </div>
        )}
      </div>

      <div className="panel-actions prize-footer">
        <span>{prizes.length === 1 ? '1 sorteio disponível' : `${prizes.length} sorteios disponíveis`}</span>
        <button type="button" onClick={onReset} disabled={disabled || !prizes.length}>
          <Trash2 size={14} /> Limpar fila
        </button>
      </div>
    </section>
  )
}
