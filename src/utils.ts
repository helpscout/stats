export const defaultOptions = {
  top: 0,
  left: 'initial',
  right: 0,
  bottom: 'initial',
  opacity: 0.5,
  position: 'fixed',
  zIndex: 99999999,
}

export const toPx = value => (typeof value === 'number' ? `${value}px` : value)

export function getTotalNodeCountFromDocument(
  doc: Document | null = window.document
): number {
  if (!doc) return 0
  return doc.getElementsByTagName('*').length
}

export function getTotalNodeCountFromFrames(): number {
  let i = 0
  let total = 0
  const frameNodes = window.document.getElementsByTagName('iframe')
  const frames = Array.from(frameNodes)

  while (i < frames.length) {
    if (frames[i].contentDocument) {
      total = total + getTotalNodeCountFromDocument(frames[i].contentDocument)
    }
    i++
  }

  return total
}

export function getTotalNodeCount(): number {
  const rootCount = getTotalNodeCountFromDocument(window.document)
  const frameCount = getTotalNodeCountFromFrames()

  return rootCount + frameCount
}
