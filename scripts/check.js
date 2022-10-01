const { api, logger, timer, checker, store, file, parser } = require('./core')

const config = {
  timeout: 60000,
  delay: 1000,
  debug: false
}

async function main() {
  logger.info('starting...')
  logger.info(`timeout: ${config.timeout}ms`)
  logger.info(`delay: ${config.delay}ms`)
  timer.start()

  const clusterLog = 'cluster.log'
  logger.info(`creating '${clusterLog}'...`)
  await file.create(clusterLog)
  await api.streams.load()
  const items = await api.streams.all()
  const total = items.length
  logger.info(`found ${total} links`)

  logger.info('checking...')
  const results = {}
  for (const [i, item] of items.entries()) {
    const message = `[${i + 1}/${total}] ${item.filepath}: ${item.url}`
    const request = {
      _id: item._id,
      url: item.url,
      http: {
        referrer: item.http_referrer,
        'user-agent': item.user_agent
      }
    }
    const result = await checker.check(request, config)
    if (!result.error) {
      logger.info(message)
    } else {
      logger.info(`${message} (${result.error.message})`)
    }
    const output = {
      _id: result._id,
      error: result.error,
      streams: result.streams,
      requests: result.requests
    }
    await file.append(clusterLog, JSON.stringify(output) + '\n')
  }

  logger.info(`done in ${timer.format('HH[h] mm[m] ss[s]')}`)
}

main()
