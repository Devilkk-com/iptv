const _ = require('lodash')
const file = require('./file')

const DATA_DIR = './scripts/data'

class API {
  constructor(filepath) {
    this.filepath = file.resolve(filepath)
  }

  async load() {
    const data = await file.read(this.filepath)
    this.collection = JSON.parse(data)
  }

  find(query) {
    return _.find(this.collection, query)
  }

  filter(query) {
    return _.filter(this.collection, query)
  }

  all() {
    return this.collection
  }
}

const api = {}

api.categories = new API(`${DATA_DIR}/categories.json`)
api.channels = new API(`${DATA_DIR}/channels.json`)
api.streams = new API(`${DATA_DIR}/streams.json`)

module.exports = api
