const { generator, api, logger, file } = require('./core')
//const { orderBy } = require('natural-orderby')
const _ = require('lodash')

async function main() {
  const streams = await loadStreams()

  logger.info('generating categories/...')
  await generator.generate('categories', streams)
  logger.info('generating playlist.category.m3u...')
  await generator.generate('playlist_category_m3u', streams)
  logger.info('generating playlist.m3u...')
  await generator.generate('playlist_m3u', streams)
}

main()

async function loadStreams() {
  await api.streams.load()
  let streams = api.streams.all()
  streams = _.filter(streams, stream => stream.status !== 'error')
  //streams = _.uniqBy(streams, stream => stream.channel || _.uniqueId())

  await api.channels.load()
  let channels = await api.channels.all()
  channels = _.keyBy(channels, 'id')

  await api.categories.load()
  let categories = await api.categories.all()
  categories = _.keyBy(categories, 'id')

  streams = streams.map(stream => {
    const channel = channels[stream.channel] || null
    if (channel) {
      stream.categories = channel.categories.map(id => categories[id]).filter(i => i)
	  stream.title = channel.name
      stream.logo = channel.logo
    } else {
      stream.categories = []
	  stream.title = ''
      stream.logo = null
    }

    return stream
  })

  //streams = orderBy(streams, ['title'], ['asc'])

  return streams
}
