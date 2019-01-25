import Stats from './Stats'

let __secretStats: any = null
let __secretStatsRAF: any = null

function destroy() {
  if (__secretStats && __secretStatsRAF) {
    cancelAnimationFrame(__secretStatsRAF)
    __secretStats.unmount()
  }
}

function createStats(options) {
  destroy()
  // @ts-ignore
  __secretStats = new Stats(options)
  __secretStats.destroy = destroy

  function tick() {
    __secretStats.begin()
    __secretStats.end()
    __secretStatsRAF = requestAnimationFrame(tick)
  }

  __secretStatsRAF = requestAnimationFrame(tick)

  return __secretStats
}

export default createStats
