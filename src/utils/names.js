export const EXAMPLE_PARTICIPANTS = [
  'Ana Clara',
  'Bruno Martins',
  'Camila Souza',
  'Diego Oliveira',
  'Elisa Fernandes',
  'Felipe Rocha',
  'Gabriela Lima',
  'Henrique Alves',
]

export function normalizeName(name) {
  return String(name ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('pt-BR')
}

export function cleanName(name) {
  return name.trim().replace(/\s+/g, ' ')
}

export function mergeUniqueNames(current, incoming) {
  const seen = new Set(current.map(normalizeName))
  const additions = []

  incoming.forEach((rawName) => {
    const name = cleanName(String(rawName ?? ''))
    const normalized = normalizeName(name)

    if (normalized && !seen.has(normalized)) {
      seen.add(normalized)
      additions.push(name)
    }
  })

  return [...current, ...additions]
}

export function getFirstCsvColumn(line) {
  const trimmed = line.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('"')) {
    let value = ''
    for (let index = 1; index < trimmed.length; index += 1) {
      if (trimmed[index] === '"' && trimmed[index + 1] === '"') {
        value += '"'
        index += 1
      } else if (trimmed[index] === '"') {
        break
      } else {
        value += trimmed[index]
      }
    }
    return value
  }

  return trimmed.split(/[;,]/)[0]
}
