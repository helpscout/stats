import { defaultOptions, getTotalNodeCount, toPx } from './utils'
import Panel from './Panel'

function Stats(options = defaultOptions) {
  const { bottom, right, opacity, position, top, left, zIndex } = {
    ...defaultOptions,
    ...options,
  }

  const container = document.createElement('div')
  container.style.cssText = `
    position:${position};
    top:${toPx(top)};
    left:${toPx(left)};
    bottom:${toPx(bottom)};
    right:${toPx(right)};
    opacity:${opacity};
    z-index:${zIndex};
    pointer-events: none;
  `

  let beginTime = (performance || Date).now()
  let prevTime = beginTime
  let frames = 0
  let nodes = 0
  let maxNodes = 0

  function addPanel(panel) {
    container.appendChild(panel.dom)
    return panel
  }

  function mount() {
    window.document.body.appendChild(container)
  }

  function unmount() {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
    beginTime = (performance || Date).now()
    prevTime = beginTime
    frames = 0
    nodes = 0
    maxNodes = 0
  }

  // @ts-ignore
  const fpsPanel = addPanel(new Panel('FPS', '#0f0', '#020'))
  let memPanel

  // @ts-ignore
  if (window.performance && window.performance.memory) {
    // @ts-ignore
    memPanel = addPanel(new Panel('MB', '#0ff', '#002'))
  }

  // @ts-ignore
  const nodesPanel = addPanel(new Panel('NODES', '#f08', '#201'))

  mount()

  return {
    dom: container,

    mount,
    unmount,

    begin: function() {
      beginTime = (performance || Date).now()
      nodes = getTotalNodeCount()

      if (nodes > maxNodes) {
        maxNodes = nodes
      }
    },

    end: function() {
      frames++

      let time = (performance || Date).now()

      // msPanel.update(time - beginTime, 200)

      if (time >= prevTime + 1000) {
        fpsPanel.update((frames * 1000) / (time - prevTime), 100)

        prevTime = time
        frames = 0

        if (memPanel) {
          // @ts-ignore
          let memory = performance.memory
          memPanel.update(
            memory.usedJSHeapSize / 1048576,
            memory.jsHeapSizeLimit / 1048576
          )
        }

        nodesPanel.update(nodes, maxNodes * 2)
      }

      return time
    },

    update: function() {
      beginTime = this.end()
    },
  }
}

export default Stats
