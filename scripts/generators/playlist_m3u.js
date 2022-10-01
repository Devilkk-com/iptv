const api = require('../core/api')
const _ = require('lodash')

module.exports = async function (streams = []) {
	//streams = _.filter(streams, stream => stream.status !== 'error')
	return { filepath: 'playlist.m3u', items: streams }
}
