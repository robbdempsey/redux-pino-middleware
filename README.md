# description
simple module you can include to allow for frontend logging. 

what does it need?
- [fast-safe-stringify](https://github.com/davidmarkclements/fast-safe-stringify) and [pino](http://getpino.io)
- a backend service to capture the logs
- you could use [this one](https://github.com/robbdempsey/hapi-pino-logger)

what does it do?
- **window.onload** - sends stats about the critical rendering path
- **window.onerror** - sends the stack and other details about the exception
- **middleware** 
   - `NODE_ENV === 'development'`: logs the action, state before the action is taken and state after the action is complete to the browser console. Follows the [Redux Middleware](https://redux.js.org/advanced/middleware#problem-logging)  logging example with groups if possible and a fallback to pino if that option is not available.
   - `NODE_ENV != 'development'`: send the action to the backend.

### example store.js using the middleware
```
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './modules'
import { default as Logger } from './redux-pino-logger'

export const history = createHistory()

const configureStore = (initialState = {}, history) => {
  const middleWares = [
    thunk,
    routerMiddleware(history),
    Logger
  ]
  const store = createStore(
    rootReducer,
    compose(applyMiddleware(...middleWares))
  )

  return store
}

export default configureStore({}, history)
```