const { file, parser, store, logger, id, api } = require('./core')
const _ = require('lodash')

const main = async () => {
	logger.info('starting...')
	await findStreams()
	logger.info('done')
};

main();

async function findStreams() {
	await api.categories.load()
	let categories = await api.categories.all()

	const channels = []
	const streams = []
	const playlist = await parser.parsePlaylist('./scripts/data/playlist.m3u')

	for (const item of playlist.items) {
		const stream = store.create()
		stream.set('id', { id: item.tvg.id })
		stream.set('name', { name: item.name })
		stream.set('categories', { categories: toCat(_.filter(categories, categorie => categorie.name == item.group.title)) })
		stream.set('logo', { logo: item.tvg.logo })
		channels.push(stream.data())
	}
	await file.create('./scripts/data/channels.json', JSON.stringify(channels, null, 2))
	for (const item of playlist.items) {
		const stream = store.create()
		stream.set('channel', { channel: item.tvg.id })
		stream.set('url', { url: item.url })
		stream.set('http_referrer', { http_referrer: item.http['referrer'] })
		stream.set('user_agent', { user_agent: item.http['user-agent'] })
		stream.set('status', { status: 'none' })
		streams.push(stream.data())
	}
/*
	for (const item of playlist.items) {
		const stream = store.create()
		stream.set('id', { id: item.tvg.id })
		stream.set('name', { name: item.name })
		stream.set('group_title', { group_title: item.group.title })
		stream.set('logo', { logo: item.tvg.logo })
		stream.set('url', { url: item.url })
		stream.set('user_agent', { user_agent: item.http['user-agent'] })
		streams.push(stream.data())
	}
*/
	await file.create('./scripts/data/streams.json', JSON.stringify(streams, null, 2))
	logger.info(`found ${streams.length} streams`)
}

function toCat(items) {
	const output = []
	for (const item of items) {
		output.push(item.id)
	}
	return output
}

function toJSON(type) {
	return JSON.stringify(type, null, 2)
}
