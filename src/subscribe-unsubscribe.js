import hash from 'object-hash'
import PubSub from 'pubsub-js'

import { isMatchUrl } from './util'

export const subscribe = (options, callbacks) => {
  if (!window.CPSF_SUBSCRIPTIONS) {
    window.CPSF_SUBSCRIPTIONS = {}
  }
  return _addEventListener(options, callbacks)
}

const _addEventListener = (
  { hostMatcher, pathnameMatcher, search },
  callbacks
) => {
  const matcherHash = hash({ hostMatcher, pathnameMatcher })

  window.CPSF_SUBSCRIPTIONS[matcherHash] = {
    hostMatcher,
    pathnameMatcher
  }

  const callback = (_matcherHash, event) => {
    const { type, host, pathname, search } = event

    isMatchUrl(
      { hostMatcher, pathnameMatcher },
      { host, pathname, search },
      () => callbacks[type] && callbacks[type](event)
    )
  }
  return PubSub.subscribe(matcherHash, callback)
}

export const unsubscribe = token => {
  PubSub.unsubscribe(token)
}
