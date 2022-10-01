const { create: createPlaylist } = require('./playlist')
const generators = require('../generators')
const logger = require('./logger')
const file = require('./file')

const PUBLIC_DIR = '.'
const generator = {}

generator.generate = async function (name, streams = []) {
  if (typeof generators[name] === 'function') {
    try {
      let output = await generators[name].bind()(streams)
      output = Array.isArray(output) ? output : [output]
      for (const type of output) {
        const playlist = createPlaylist(type.items, { public: true })
        await file.create(`${PUBLIC_DIR}/${type.filepath}`, playlist.toString())
      }
    } catch (error) {
      logger.error(`generators/${name}.js: ${error.message}`)
    }
  }
}

module.exports = generator
