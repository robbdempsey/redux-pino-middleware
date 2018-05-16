import { sendXL, logger } from './logger'
import './window-global-events'

const loggingConfig = { 
  url: 'http://localhost:3000/logging',
  level: 'info'
}

function LoggerMiddleware() {
  // NOTE: this will log all actions
  return ({ dispatch, getState }) => next => action => {
    if (process.env.NODE_ENV === 'development') {
      // capture the state before our action is dispatched
      const prevState = getState()
      // dispatch the action
      let result = next(action)
      // capture the state after the action has finished
      const nextState = getState()
      
      if (console.group) {
        // setup grouping based on our action.type
        console.group(action.type)
        console.info('dispatching', action)
        console.log('prev state', prevState)
        console.log('next state', nextState)
        //close out our console group
        console.groupEnd(action.type)
        // return the result of the action
      } else {
        logger({ level: loggingConfig.level }, { action, prevState, nextState })
      }

      return result
    } else {
      sendXL(loggingConfig, { action })
      return next(action)
    }
  }
}

const loggerMiddleware = LoggerMiddleware()

export {loggerMiddleware as default}
