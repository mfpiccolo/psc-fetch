# Pub/Sub Cache Fetch

This is a lightweight library focused on adding Pub/Sub and caching apis to `fetch`

## Install

`npm i psc-fetch -S`

## Import

```javascript
import pSCFetch, { publish, subscribe } from 'psc-fetch'
```

## Fetch and Caching

`pSCFetch` function is a wrapper around fetch. It has the same signature as [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) but with an added expiry key. This expects milliseconds to indicate cache duration.

```javascript
import pSCFetch from 'psc-fetch'

async function example(pathname) {
  const response = await pSCFetch('https://fakeexample.com/users/1', {
    expiry: 6000 // milliseconds while localstorage cache will be returned instead of new fetch
  })
}
```

## Pub/Sub

`subscribe` takes in matchers and callbacks. Matchers can be strings for exact match or regex. These are used to match against the fetch url. If a fetch is made that matches the matchers it will call the associated callbacks for `loading`, `success` and `error`.

Here is an example of how you could use this with React hooks.

```javascript
import React, { useState, useEffect } from 'react'
import { subscribe, unsubscribe } from 'psc-fetch'

export default function Loader() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribeToken = subscribe(
      {
        hostMatcher: 'fakeexample.com',
        pathnameMatcher: /users\/\d/
      },
      {
        loading: () => setLoading(true),
        success: ({ response }) => setLoading(false),
        error: ({ error }) => console.log(error)
      }
    )
    return () => {
      unsubscribe(unsubscribeToken)
    }
  }, [])

  return loading && <Spinner />
}
```

## React Demo

This demo app shows how you can use this to implement caching and loading states easily throughout the tree.

[Demo React App Repo](https://github.com/mfpiccolo/demo-psc-fetch)

[Demo React App CodeSandbox](https://codesandbox.io/s/agitated-proskuriakova-5nf5k)

A few highlights from the demo:

Most applications that use `pcs-fetch` (same if you are using `fetch`) would have use an abstraction like [this api file](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/api.js).

Subscribers can be anywhere in the tree no matter where the fetch is being called. This [Loader](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/Loader.js) is being passed a subscription which is handling the loading state based on the callbacks. You can see it works even at the top level [App](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/App.js#L12) component even when child components fetch. You will also notice that the top level loader is [subscribing](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/api.js#L7) to anything coming from that particular host api where [other Loaders](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/PostsPage.js#L21) are more specific to routes.

The [PostsPage](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/PostsPage.js) is a good example of using an [api abstraction](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/api.js).

The [PostPage](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/PostPage.js) is an example of using the subscribe api directly and [using the subscription data for state](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/PostPage.js#L17).

The [UserPage](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/PostPage.js) is an example of using the subscribe api directly but using the [response directly](https://github.com/mfpiccolo/demo-psc-fetch/blob/master/src/UserPage.js).
