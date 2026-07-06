export const PRIZE_CATALOG = {
  headset: {
    name: 'Fone HAVIT GameNote Fuxi-HD5',
    image: '/assets/premios/fone.webp',
  },
  mouse: {
    name: 'Mouse Redragon Cobra M711',
    image: '/assets/premios/mouse.avif',
  },
  keyboard: {
    name: 'Teclado Redragon Fizz RGB',
    image: '/assets/premios/teclado.avif',
  },
}

export const PRIZE_TEMPLATES = [
  PRIZE_CATALOG.headset,
  PRIZE_CATALOG.mouse,
  PRIZE_CATALOG.keyboard,
]

export const DEFAULT_PRIZES = []

export function createPrize(prize) {
  const data = typeof prize === 'string' ? { name: prize } : prize

  return {
    id: `prize-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: data.name.trim().replace(/\s+/g, ' '),
    image: data.image || null,
  }
}
