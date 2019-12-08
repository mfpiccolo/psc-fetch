# Pub/Sub Cache Fetch

This is a lightweight library focused on adding Pub/Sub and caching apis to `fetch`

## Fetch and Caching

`pSCFetch` function is a wrapper around fetch. It has the same signature as [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) but with an added expiry key. This expects milliseconds to indicate cache duration.

```javascript
import pSCFetch, { publish, subscribe } from 'psc-fetch'

async function example(pathname) {
  const response = await pSCFetch('https://fakeexample.com/users/1', {
    expiry: 6000 // milliseconds while localstorage cache will be returned instead of new fetch
  })
}
```

## Pub/Sub

`subscribe` takes in matchers and callbacks. Matchers can be strings for exact match or regex. These are used to match against the fetch url. If a fetch is made that matches the matchers it will call the associated callbacks for "loading", "success" and "error".

Here is an example of how you could use this with React hooks.

```javascript
import React, { useState, useEffect } from 'react'
import { subscribe, unsubscribe } from 'psc-fetch'

export default function Loader() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const callbacks = {
      loading: () => setLoading(true),
      success: () => setLoading(false),
      error: () => alert('error')
    }

    const token = subscribe({
      hostMatcher: 'fakeexample.com',
      pathnameMatcher: /users\/\d/,
      callbacks
    })
    return () => {
      unsubscribe(token, callbacks)
    }
  }, [])

  return loading && <Spinner />
}
```

## React Demo

This demo app shows how you can use this to implement caching and loading states easily throughout the tree.

https://github.com/mfpiccolo/demo-http-cache
