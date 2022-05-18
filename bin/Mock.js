const chokidar = require('chokidar')
const { pathToRegexp } = require('path-to-regexp')

class Mock {
  constructor(directory, ignored) {
    this.map = {}
    this.init(directory, ignored)
  }

  init(directory, ignored) {
    const options = ignored ? { ignored } : {}
    this.watcher = chokidar
      .watch(directory, options)
      .on('add', path => this.update(path))
      .on('change', path => this.update(path))
      .on('unlink', path => this.remove(path))
  }

  close() {
    this.watcher.close()
  }

  update(path) {
    console.log(`update ${path}`)
    // must delete cache first, otherwise we will still get old file after change
    delete require.cache[path]
    this.map[path] = require(path)
  }

  remove(path) {
    console.log(`remove ${path}`)
    delete this.map[path]
  }

  find(key) {
    for (const path in this.map) {
      const config = this.map[path]
      for (const k in config) {
        const reg = pathToRegexp(k)
        if (reg.exec(key)) {
          return config[k]
        }
      }
    }
  }
}

module.exports = Mock
