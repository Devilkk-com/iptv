const { create: createPlaylist } = require('./core/playlist')
const api = require('./core/api.js');
const file = require('./core/file.js');
const _ = require('lodash')

const main = async () => {
	const streams = await loadStreams()
	const playlist = createPlaylist(streams, { public: true })
	await file.create('playlist.m3u', playlist.toString())
};

main();

async function loadStreams() {
	await api.streams.load()
	let streams = api.streams.all()
	streams = _.filter(streams, stream => stream.status !== 'error')

	await api.channels.load()
	let channels = await api.channels.all()
	channels = _.keyBy(channels, 'id')

	await api.categories.load()
	let categories = await api.categories.all()
	categories = _.keyBy(categories, 'id')

	streams = streams.map(stream => {
		const channel = channels[stream.channel] || nul
		if (channel) {
			stream.title = channel.name
			stream.categories = channel.categories.map(id => categories[id]).filter(i => i)
			stream.logo = channel.logo
		} else {
			stream.title = ""
			stream.categories = []
			stream.logo = null
		}
		return stream
	})
	//streams = orderBy(streams, ['title'], ['asc'])

	return streams
}
