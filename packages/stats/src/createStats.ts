import Stats from './Stats'

function createStats() {
  // @ts-ignore
  let stats = new Stats()

  function animate() {
    stats.begin()
    stats.end()
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

export default createStats
