function random(str) {
  const [min, max] = str.split('-').map(x => Number(x))
  const num = min + Math.round(Math.random() * (max - min))
  return num
}

module.exports = {
  random,
}
