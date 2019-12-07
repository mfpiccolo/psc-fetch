export const isMatchUrl = (
  { hostMatcher, pathnameMatcher },
  { host, pathname, search },
  callback
) => {
  if (hostMatcher && pathnameMatcher && search) {
    // TODO special handling for search object
  } else if (hostMatcher && pathnameMatcher) {
    if (_isMatch(hostMatcher, host) && _isMatch(pathnameMatcher, pathname))
      callback()
  } else if (hostMatcher) {
    if (_isMatch(hostMatcher, host)) callback()
  } else {
  }
}

const _isMatch = (matcher, matchee) => {
  const isRegex = matcher instanceof RegExp
  const isString = typeof matcher === 'string'
  if (isRegex) {
    if (matcher.test(matchee)) return true
  } else if (isString) {
    if (matcher === matchee) return true
  }
}
