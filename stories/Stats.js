const defaultOptions = {
  top: 0,
  left: 'initial',
  right: 0,
  bottom: 'initial',
  opacity: 0.5,
  zIndex: 99999999,
}

function Stats(options = defaultOptions) {
  const {bottom, right, opacity, top, left, zIndex} = {
    ...defaultOptions,
    ...options,
  }

  const container = document.createElement('div')
  container.style.cssText = `
    position:fixed;
    top:${top};
    left:${left};
    bottom:${bottom};
    right:${right};
    opacity:${opacity};
    z-index:${zIndex};
    pointer-events: none;
  `

  function addPanel(panel) {
    container.appendChild(panel.dom)
    return panel
  }

  function mount() {
    window.document.body.appendChild(container)
  }

  function unmount() {
    container.parentNode.removeChild(container)
  }

  let beginTime = (performance || Date).now(),
    prevTime = beginTime,
    frames = 0,
    nodes = 0,
    maxNodes = 0

  const fpsPanel = addPanel(new Stats.Panel('FPS', '#0f0', '#020'))
  let memPanel

  if (window.performance && window.performance.memory) {
    memPanel = addPanel(new Stats.Panel('MB', '#0ff', '#002'))
  }

  const nodesPanel = addPanel(new Stats.Panel('NODES', '#f08', '#201'))

  // const msPanel = addPanel(new Stats.Panel('MS', '#0f0', '#020'))

  mount()

  return {
    dom: container,

    mount,
    unmount,

    begin: function() {
      beginTime = (performance || Date).now()
      nodes = document.querySelectorAll('*').length

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
          let memory = performance.memory
          memPanel.update(
            memory.usedJSHeapSize / 1048576,
            memory.jsHeapSizeLimit / 1048576,
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

Stats.Panel = function(name, fg, bg) {
  let min = Infinity,
    max = 0,
    round = Math.round
  let PR = round(window.devicePixelRatio || 1)

  let WIDTH = 80 * PR,
    HEIGHT = 48 * PR,
    TEXT_X = 3 * PR,
    TEXT_Y = 2 * PR,
    GRAPH_X = 3 * PR,
    GRAPH_Y = 15 * PR,
    GRAPH_WIDTH = 74 * PR,
    GRAPH_HEIGHT = 30 * PR

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  canvas.style.cssText = 'width:80px;height:48px'

  const context = canvas.getContext('2d')
  context.font = 'bold ' + 9 * PR + 'px Helvetica,Arial,sans-serif'
  context.textBaseline = 'top'

  context.fillStyle = bg
  context.fillRect(0, 0, WIDTH, HEIGHT)

  context.fillStyle = fg
  context.fillText(name, TEXT_X, TEXT_Y)
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

  context.fillStyle = bg
  context.globalAlpha = 0.9
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

  return {
    dom: canvas,

    update: function(value, maxValue) {
      min = Math.min(min, value)
      max = Math.max(max, value)

      context.fillStyle = bg
      context.globalAlpha = 1
      context.fillRect(0, 0, WIDTH, GRAPH_Y)
      context.fillStyle = fg
      context.fillText(
        round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')',
        TEXT_X,
        TEXT_Y,
      )

      context.drawImage(
        canvas,
        GRAPH_X + PR,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT,
        GRAPH_X,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT,
      )

      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT)

      context.fillStyle = bg
      context.globalAlpha = 0.9
      context.fillRect(
        GRAPH_X + GRAPH_WIDTH - PR,
        GRAPH_Y,
        PR,
        round((1 - value / maxValue) * GRAPH_HEIGHT),
      )
    },
  }
}

export {Stats as default}
