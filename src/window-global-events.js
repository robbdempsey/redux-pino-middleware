import {send} from './logger'

const config = {
  url: 'http://localhost:3000/logging'
}
// catch any script errors that may be out of our control
window.onerror = (message, source, lineno, colno, error) => {
  send(config, {level: 'fatal', lineno, colno, message, error})
}
// gather performance stats for critical rendering path
window.onload = () => {
  const { timing } = window.performance
  const { pathname } = window.location
  
  send(
    config,
    {
      level: 'info', 
      type: 'ms',
      description: 'critical rendering path',
      pathname,
      domInteractive: timing.domInteractive - timing.domLoading,
      domContentLoaded: timing.domContentLoadedEventStart - timing.domLoading,
      domComplete: timing.domComplete - timing.domLoading
    }
  )
}
