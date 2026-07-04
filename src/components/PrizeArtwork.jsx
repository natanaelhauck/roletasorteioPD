import { Gift } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PrizeArtwork({
  image,
  name,
  className = '',
  eager = false,
}) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [image])

  if (!image || hasError) {
    return (
      <div
        className={`prize-artwork prize-artwork-placeholder ${className}`}
        aria-label={`Imagem ilustrativa de ${name}`}
      >
        <Gift aria-hidden="true" />
        <span>{name?.slice(0, 1) || 'P'}</span>
      </div>
    )
  }

  return (
    <div className={`prize-artwork ${className}`}>
      <img
        src={image}
        alt={name}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setHasError(true)}
      />
    </div>
  )
}
