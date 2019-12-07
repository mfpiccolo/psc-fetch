import hash from 'object-hash'

import { isMatchUrl } from './util'

export const subscribe = (options, callbacks) => {
  if (!window.CPSF_SUBSCRIPTIONS) {
    window.CPSF_SUBSCRIPTIONS = {}
  }
  return _addEventListener(options, callbacks)
}

export const unsubscribe = (matcherHash, callbacks) => {
  window.removeEventListener(matcherHash, callbacks)
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

  window.addEventListener(matcherHash, event => {
    const { type, host, pathname, search } = event.detail

    isMatchUrl(
      { hostMatcher, pathnameMatcher },
      { host, pathname, search },
      () => callbacks[type](event)
    )
  })
  return { matcherHash, callbacks }
}
