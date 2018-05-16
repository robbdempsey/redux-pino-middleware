
const Pino = require('pino')
const stringify = require('fast-safe-stringify')
const defaults = {
  browser: {
    asObject: true,
    serialize: true
  }
}

class Logger {
  constructor(context) {
    let withTransmit = {}

    if (context && context.url) {
      withTransmit = {
        browser: {
          transmit: {
            level: (context.level) ? context.level : 'info',
            send: (level, logEvent) => {
              const stringifiedLogEvent = stringify(logEvent)

              fetch(
                context.url,
                {
                  body: stringifiedLogEvent,
                  headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': stringifiedLogEvent.length.toString()
                  },
                  method: 'POST',
                  mode: 'cors'
                }
              )
            }
          }
        }
      }
    }

    const options = Object.assign({}, defaults, withTransmit)
  
    return new Pino(options)
  } 
}

function pinoLogger(config, data) {
  const level = (config.level) ? config.level : 'error'
  const logger = new Logger({
    level,
    url: config.url
  })

  logger[level](data)
}
function sendFetchEvent(config, data) {
  if (config && config.url) {
    const stringifiedLogEvent = stringify(data)
    fetch(
      config.url,
      {
        body: stringifiedLogEvent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': stringifiedLogEvent.length.toString()
        },
        method: 'POST',
        mode: 'cors'
      }
    )
  }
}
// NOTE: sendBeacon should be limited to events that are less than 64K
// https://github.com/w3c/beacon/issues/38
// https://github.com/w3c/beacon/pull/39
function sendBeaconEvent(config, data) {
  if (config && config.url) {
    const stringifiedLogEvent = stringify(data)
    navigator.sendBeacon(config.url, stringifiedLogEvent)
  }
}

export {sendBeaconEvent as send, sendFetchEvent as sendXL, pinoLogger as logger} 
