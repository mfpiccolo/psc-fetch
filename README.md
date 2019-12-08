# Pub/Sub Cache Fetch

This is a lightweight library focused on adding Pub/Sub and caching apis to `fetch`

## Fetch and Caching

`pSCFetch` function is a wrapper around fetch. It has the same signature as [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) but with an added expiry key. This expects milliseconds to indicate cache duration.

```javascript
import pSCFetch, { publish, subscribe } from 'psc-fetch'

async function example(pathname) {
  const response = await pSCFetch('https://fakeexample.com/users/1', {
    expiry: 6000 // milliseconds until the same fetch can be made
  })
}
```

## Pub/Sub

`subscribe` takes in matchers and callbacks. Matchers can be strings for exact match or regex. These are used to match against the fetch url. If a fetch is made that matches the matchers it will call the associated callbacks for "loading", "success" and "error".

Here is an example of how you could use this with React hooks.

```javascript
useEffect(() => {
  const callbacks = {
    loading: () => console.log('loading'),
    success: () => console.log('success'),
    error: () => console.log('error')
  }

  const token = subscribe({
    hostMatcher: 'https://fakeexample.com',
    pathnameMatcher: /users\/\d/,
    callbacks
  })
  return () => {
    unsubscribe(token, callbacks)
  }
}, [])
```

## React Demo

https://github.com/mfpiccolo/demo-http-cache
