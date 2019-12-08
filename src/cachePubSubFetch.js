import PubSub from 'pubsub-js'

import { isMatchUrl } from './util'

export default function cachePublishFetch(url, opts) {
  const { expiry, ...options } = opts

  // Use the URL as the cache key to sessionStorage
  const cacheKey = url
  const cached = localStorage.getItem(cacheKey)
  const whenCached = localStorage.getItem(cacheKey + ':ts')
  if (cached !== null && whenCached !== null) {
    const age = Date.now() - whenCached
    if (age < expiry) {
      const response = new Response(new Blob([cached]))
      _matchAndDispatchEvents({
        url,
        type: 'success',
        response
      })
      return Promise.resolve(response)
    } else {
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(cacheKey + ':ts')
    }
  }

  _matchAndDispatchEvents({ url, type: 'loading' })

  return fetch(url, options)
    .then(response => {
      if (response.status === 200) {
        let ct = response.headers.get('Content-Type')
        if (ct && ct.match(/application\/json/i)) {
          response
            .clone()
            .json()
            .then(content => {
              localStorage.setItem(cacheKey, JSON.stringify(content))
              localStorage.setItem(cacheKey + ':ts', Date.now())
            })
        }
        _matchAndDispatchEvents({
          url,
          type: 'success',
          response: response.clone()
        })
      }
      return response
    })
    .catch(error => {
      _matchAndDispatchEvents({ url, type: 'error', error })
    })
}

const _matchAndDispatchEvents = ({ url, type, response, error }) => {
  Object.entries(window.CPSF_SUBSCRIPTIONS).forEach(
    ([matcherHash, { hostMatcher, pathnameMatcher }]) => {
      const { host, pathname } = _parseURL(url)

      isMatchUrl({ hostMatcher, pathnameMatcher }, { host, pathname }, () => {
        _dispatchEvent({ matcherHash, url, type, response, error })
      })
    }
  )
}

const _dispatchEvent = ({ matcherHash, url, type, response, error }) => {
  PubSub.publish(matcherHash, {
    matcherHash,
    ..._parseURL(url),
    type,
    response,
    error
  })
}

function _parseURL(url) {
  var parser = document.createElement('a'),
    searchObject = {},
    queries,
    split,
    i

  parser.href = url

  queries = parser.search.replace(/^\?/, '').split('&')
  for (i = 0; i < queries.length; i++) {
    split = queries[i].split('=')
    searchObject[split[0]] = split[1]
  }
  return {
    url,
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    searchObject: searchObject,
    hash: parser.hash
  }
}
