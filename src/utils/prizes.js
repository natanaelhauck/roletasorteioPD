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

export const DEFAULT_PRIZES = [
  ...Array.from({ length: 3 }, (_, index) => ({
    id: `headset-${index + 1}`,
    ...PRIZE_CATALOG.headset,
  })),
  ...Array.from({ length: 3 }, (_, index) => ({
    id: `mouse-${index + 1}`,
    ...PRIZE_CATALOG.mouse,
  })),
  {
    id: 'keyboard-1',
    ...PRIZE_CATALOG.keyboard,
  },
]

export function createPrize(name) {
  return {
    id: `prize-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: name.trim().replace(/\s+/g, ' '),
    image: null,
  }
}
